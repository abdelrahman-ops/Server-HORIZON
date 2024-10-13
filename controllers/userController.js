// Ali + Abdelrahman + Ahmed

// import multer from 'multer';
import { response } from "express";

import User from "../models/user.js";
import Notice from "../models/notification.js";

// import bcrypt from 'bcryptjs';
import { createJWT , clearJWT  } from '../utils/utility.js';


export const registerUser = async (req, res) => {
    try {
        const { name , email , password , isAdmin , role , title} = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                status: false,
                message: "User already exists"
            });
        }

        const newUser = await User.create({
            name,
            email,
            password,
            isAdmin,
            role,
            title,
        });

        if (newUser) {
            const savedUser = await newUser.save();

            const token = createJWT(res, newUser._id);

            savedUser.password = undefined;

            res.status(201).json({
                status: true,
                message: 'User created successfully',
                data: {
                    user: savedUser,
                    token
                },
            })
        }else {
            return res.status(400).json({ 
                status: false, 
                message: "Invalid user data" 
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        const isMatch = await user.matchPassword(password);

        if (!user || !isMatch) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or password"
            });
        }
        if (!user?.isActive) {
            return res.status(401).json({
                status: false,
                message: "User account has been deactivated, contact the administrator",
            });
        }
        
        const token = createJWT(res, user._id);
        res.status(200).json({
            status: true,
            message: "Login successful",
            data: {
                user,
                token
            },
            
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

export const logoutUser = async (req, res) => {
    try {
        clearJWT(res);
    
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

export const getTeamList = async (req, res) => {
    try {
    const users = await User.find().select("name title role email isActive");

    res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const getNotificationsList = async (req, res) => {
    try {
        const { userId } = req.user;

        const notice = await Notice.find({
            team: userId,
            isRead: { $nin: [userId] },
        }).populate("task", "title");

        res.status(201).json(notice);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        console.log("req.user update profile:", req.user);
        const { userId, isAdmin } = req.user;
        const { _id } = req.body;

        // const id = isAdmin && userId === _id ? userId : isAdmin && userId !== _id ? _id : userId;
        const id = isAdmin && _id ? _id : userId;

        const user = await User.findById(id);

        if (user) {
                user.name = req.body.name || user.name;
                user.title = req.body.title || user.title;
                user.role = req.body.role || user.role;

                const updatedUser = await user.save();

                user.password = undefined;

                res.status(201).json({
                status: true,
                message: "Profile Updated Successfully.",
                user: updatedUser,
            });
        } else {
            res.status(404).json({ status: false, message: "User not found profile" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const markNotificationRead = async (req, res) => {
    try {
        const { userId } = req.user;

        const { isReadType, id } = req.query;

        if (isReadType === "all") {
            await Notice.updateMany(
                { team: userId, isRead: { $nin: [userId] } },
                { $push: { isRead: userId } },
                { new: true }
            );
        } else {
            await Notice.findOneAndUpdate(
                { _id: id, isRead: { $nin: [userId] } },
                { $push: { isRead: userId } },
                { new: true }
            );
        }

        res.status(201).json({ status: true, message: "Done" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const changeUserPassword = async (req, res) => {
    try {
        console.log("req.user:", req.user);
        const { userId } = req.user;
        
        
        const user = await User.findById(userId);

        if (user) {
            user.password = req.body.password;

            await user.save();

            user.password = undefined;

            res.status(201).json({
            status: true,
            message: `Password changed successfully.`,
        });
    } else {
        res.status(404).json({ status: false, message: "User not found" });
    }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const activateUserProfile = async (req, res) => {
    try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user) {
        user.isActive = req.body.isActive;

        await user.save();

        res.status(201).json({
        status: true,
        message: `User account has been ${user?.isActive ? "activated" : "disabled"}`,
        });
    } else {
        res.status(404).json({ status: false, message: "User not found" });
    }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const deleteUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        await User.findByIdAndDelete(id);

    res
        .status(200)
        .json({ status: true, message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};