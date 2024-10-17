import express from "express" ;
import {isAdminRoute, protectRoute } from "../middleware/authMiddlewares.js"
import {
    createSubTask,
    createTask,
    dashboardStatistics,
    deleteRestoreTask,
    duplicateTask,
    getTask,
    getTasks,
    postTaskActivity,
    trashTask,
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


router.post("/create", isAdminRoute , createTask);
router.post("/duplicate/:id" , isAdminRoute , duplicateTask);
router.post("/activity/:id" , postTaskActivity);

router.get("/" , getTasks)
router.get("/:id" , getTask)
router.get("/statistics/dashboard", dashboardStatistics);



router.put("/create-subtask/:id" , isAdminRoute , createSubTask)
router.put("/update/:id" , updateTask);
router.put("/:id" , isAdminRoute , trashTask);


router.delete("/delete-restore/:id/:actionType", deleteRestoreTask);

export default router;