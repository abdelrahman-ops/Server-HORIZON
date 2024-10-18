import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
  console.log("🚀 ~ protectRoute ~ req:", req);
  try {
    let token = req.headers.authorization.split(" ")[1];

    console.log(token, "toooken");

    if (token) {
      try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decodedToken); // Verify token contents

        // Fetch user details using decodedToken.userId (correct field)
        const resp = await User.findById(decodedToken.userId).select(
          "isAdmin email"
        );

        if (!resp) {
          return res
            .status(401)
            .json({ status: false, message: "User not found." });
        }

        // Attach user info to the request object
        req.user = {
          email: resp.email,
          isAdmin: resp.isAdmin,
          userId: decodedToken.userId, // Correct field
        };

        console.log("User authenticated:", req.user);
        next();
      } catch (err) {
        console.log("Token verification error:", err.message);
        return res.status(401).json({
          status: false,
          message: "Invalid or expired token. Please log in again.",
        });
      }
    } else {
      return res.status(401).json({
        status: false,
        message: "Missing Token - Not authorized. Try logging in again.",
      });
    }
  } catch (error) {
    console.log("Authentication error:", error.message);
    return res.status(401).json({
      status: false,
      message: "Not authorized. Try logging in again.",
    });
  }
};

const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};

export { isAdminRoute, protectRoute };