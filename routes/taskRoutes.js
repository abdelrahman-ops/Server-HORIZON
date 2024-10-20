import express from "express" ;
import {isAdminRoute, protectRoute } from "../middleware/authMiddlewares.js"
import {
    createSubTask,
    createTask,
    dashboardStatistics,
    duplicateTask,
    getTask,
    getTasks,
    postTaskActivity,
    trashOrRestoreTask,
    deleteTask,
    updateTask,
} from "../controllers/taskController.js"


const router = express.Router();


// To access api : https://server-horizon.vercel.app/api/task/$
router.post("/create" , protectRoute, isAdminRoute , createTask);
router.post("/duplicate/:id" , protectRoute, isAdminRoute, duplicateTask);
router.post("/activity/:id" ,protectRoute, postTaskActivity);

router.get("/" , protectRoute, getTasks)
router.get("/:id" ,protectRoute, getTask)
router.get("/statistics/dashboard", protectRoute ,dashboardStatistics);



router.put("/create-subtask/:id" , protectRoute , isAdminRoute , createSubTask)
router.put("/update/:id" , protectRoute ,updateTask);
router.put("/:id" , protectRoute , isAdminRoute , trashOrRestoreTask);


router.delete("/delete/:id", protectRoute , deleteTask);

export default router;