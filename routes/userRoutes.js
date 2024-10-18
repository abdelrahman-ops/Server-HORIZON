import express from "express" ;
import {isAdminRoute, protectRoute } from "../middleware/authMiddlewares.js"
import {
    activateUserProfile,
    changeUserPassword,
    deleteUserProfile,
    getNotificationsList,
    getTeamList,
    loginUser,
    logoutUser,
    markNotificationRead,
    registerUser,
    updateUserProfile,
} from "../controllers/userController.js"

const router = express.Router();


// To access api : https://server-horizon.vercel.app/api/user/$
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.put("/change-password", protectRoute, changeUserPassword);
router.put("/profile", protectRoute, updateUserProfile);
router.put("/read-noti", protectRoute, markNotificationRead);

router.get("/login/not", getNotificationsList);
router.get("/login",  getTeamList);


router
    .route("/:id")
    .put(protectRoute, isAdminRoute, activateUserProfile)
    .delete(protectRoute, isAdminRoute , deleteUserProfile);


export default router;