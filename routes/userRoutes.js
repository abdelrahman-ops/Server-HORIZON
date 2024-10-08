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

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/login", logoutUser);

router.put("/change-password", protectRoute, changeUserPassword);
router.put("/profile", protectRoute, updateUserProfile);
router.put("/read-noti", protectRoute, markNotificationRead);

router.get("/login",protectRoute, getNotificationsList);
router.get("/login",protectRoute, isAdminRoute ,getTeamList);


router
    .route("/:id")
    .put(protectRoute, isAdminRoute, activateUserProfile)
    .delete(protectRoute, isAdminRoute , deleteUserProfile);


export default router;