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
// router.post("/create", protectRoute , isAdminRoute , createTask);
// router.post("/duplicate/:id", protectRoute , isAdminRoute , duplicateTask);
// router.post("/activity/:id", protectRoute , postTaskActivity);

// router.get("/" ,protectRoute , getTasks)
// router.get("/:id" ,protectRoute , getTask)
// router.get("/statistics/dashboard", protectRoute, dashboardStatistics);



// router.put("/create-subtask/:id", protectRoute , isAdminRoute , createSubTask)
// router.put("/update/:id", protectRoute , updateTask);
// router.put("/:id", protectRoute , isAdminRoute , trashTask);


// router.delete("/delete-restore/:id/:actionType", protectRoute, deleteRestoreTask);


router.post("/create" , protectRoute, isAdminRoute , createTask);
router.post("/duplicate/:id" , protectRoute, duplicateTask);
router.post("/activity/:id" , postTaskActivity);

router.get("/" , getTasks)
router.get("/:id" , getTask)
router.get("/statistics/dashboard", dashboardStatistics);



router.put("/create-subtask/:id" , createSubTask)
router.put("/update/:id" , updateTask);
router.put("/:id" , trashOrRestoreTask);


router.delete("/delete-restore/:id", deleteTask);

export default router;