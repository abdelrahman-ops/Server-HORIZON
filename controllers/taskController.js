// Ali + Abdelrahman + Ahmed
import Notice from "../models/notification.js";
import Task from "../models/task.js";
import User from "../models/user.js";

export const createTask = async (req, res) => {
    try {
        const { userId } = req.user;
        const {title  ,stage,date , priority, assets } = req.body;
        
        let text = "New task has been assigned to you";
        if (team?.length > 1) {
            text = text + `and ${team?.length - 1} others.`;
        }

        text = 
            text +
                `The task priority is set a ${priority}, so check and act accordingly. 
                The task date is ${new Date(date).toDateString()}. Thankyou!!!`;

        const activity = {
            type : "assigned",
            activity : text,
            by: userId,
        }

        const task = await Task.create({
            title,
            team,
            stage: stage.toLowerCase(),
            date,
            priority: priority.toLowerCase(),
            assets,
            activities: activity,
        });

        

        res
            .status(200)
            .json({ status: true, task, message: "Task created successfully." });
        } 
    catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const duplicateTask = async (req, res) => {
};

export const postTaskActivity = async (req, res) => {
};

export const dashboardStatistics = async (req, res) => {
};

export const getTasks = async (req, res) => {
    try{
        const {stage , isTrashed} = req.query;

        let query = {isTrashed: isTrashed ? true : false};

        if (stage) {
            query.stage = stage;
        }

        let queryResult = Task.find(query)
        .populate({
            path: "team",
            select: "name title email",
        })
        .sort({_id: -1})

        const tasks = await queryResult;

        res.status(200).json({
            status: true,
            tasks,
        })
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({status: false , message : error.message });
    }
};

export const getTask = async (req, res) => {
};

export const createSubTask = async (req, res) => {
};

export const updateTask = async (req, res) => {
};

export const trashTask = async (req, res) => {
};

export const deleteRestoreTask = async (req, res) => {
};