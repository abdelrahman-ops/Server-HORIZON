import Notice from "../models/notification.js";
import Task from "../models/task.js";
import User from "../models/user.js";

export const createTask = async (req, res) => {
  try {
    const { userId } = req.user;
    console.log("from create task: ", req.user);

    const { title, stage, date, priority, assets, team } = req.body;

    let text = "New task has been assigned to you";
    if (team?.length > 1) {
      text = text + `and ${team?.length - 1} others.`;
    }

    text =
      text +
      `The task priority is set a ${priority} priority, so check and act accordingly. 
                The task date is ${new Date(date).toDateString()}. Thankyou!!!`;

    const activity = {
      type: "assigned",
      activity: text,
      by: userId,
    };

    const task = await Task.create({
      title,
      team,
      stage: stage.toLowerCase(),
      date,
      priority: priority.toLowerCase(),
      assets,
      activities: [activity],
    });

    await Notice.create({
      team,
      text,
      task: task._id,
    });

    res
      .status(200)
      .json({ status: true, task, message: "Task created successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const duplicateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    const newTask = await Task.create({
      title: task.title + " - Duplicate",
      team: task.team,
      subTasks: task.subTasks,
      assets: task.assets,
      priority: task.priority,
      stage: task.stage,
      date: task.date,
      activities: task.activities,
    });

    let text = "New task has been assigned to you";
    if (task.team.length > 1) {
      text = text + ` and ${task.team.length - 1} others.`;
    }

    text =
      text +
      ` The task priority is set as ${
        task.priority
      } priority, so check and act accordingly. 
                The task date is ${new Date(
                  task.date
                ).toDateString()}. Thank you!`;

    await Notice.create({
      team: task.team,
      text,
      task: newTask._id,
    });

    res.status(200).json({
      status: true,
      message: "Task duplicated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const postTaskActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { type, activity } = req.body;

    const task = await Task.findById(id);

    const data = {
      type,
      activity,
      by: userId,
    };

    task.activities.push(data);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const dashboardStatistics = async (req, res) => {
  console.log(req.params);
  console.log(req.user);
  try {
    const { userId, isAdmin } = req.user;
    console.log(userId);

    const allTasks = isAdmin
      ? await Task.find({ isTrashed: false })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 })
      : await Task.find({
          isTrashed: false,
          team: { $all: [userId] },
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 });

    const users = await User.find({ isActive: true })
      .select("name title role isAdmin createdAt")
      .limit(10)
      .sort({ _id: -1 });

    //   group task by stage and calculate counts
    const groupTasks = allTasks.reduce((result, task) => {
      const stage = task.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});

    // Group tasks by priority
    const groupData = Object.entries(
      allTasks.reduce((result, task) => {
        const { priority } = task;

        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    // calculate total tasks
    const totalTasks = allTasks?.length;
    const last10Task = allTasks?.slice(0, 10);

    const summary = {
      totalTasks,
      last10Task,
      users: isAdmin ? users : [],
      tasks: groupTasks,
      graphData: groupData,
    };

    res.status(200).json({
      status: true,
      message: "Successfully",
      ...summary,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// export const getTasks = async (req, res) => {
//   try {
//     const { stage, isTrashed } = req.query;

//     let query = { isTrashed: isTrashed ? true : false };

//     if (stage) {
//       query.stage = stage;
//     }
//     let queryResult = Task.find(query)
//       .populate({
//         path: "team",
//         select: "name title email",
//       })
//       .sort({ _id: -1 });
//     const tasks = await queryResult;
//     // const tasks = await Task.find(query).sort({ _id: -1 });

//     res.status(200).json({
//       status: true,
//       tasks,
//     });
//   } catch (error) {
//     console.log("Error in getTasks:", error);
//     return res.status(400).json({ status: false, message: error.message });
//   }
// };


export const getTasks = async (req, res) => {
    try {
      const { stage } = req.query;  // Removed `isTrashed` from backend filtering
  
      // Build the query, but don't filter by `isTrashed`
      let query = {};
  
      if (stage) {
        query.stage = stage;
      }
  
      let queryResult = Task.find(query)
        .populate({
          path: "team",
          select: "name title email",
        })
        .sort({ _id: -1 });
  
      const tasks = await queryResult;
  
      res.status(200).json({
        status: true,
        tasks, // Send all tasks (trashed and not trashed)
      });
    } catch (error) {
      console.log("Error in getTasks:", error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  
export const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate({
        path: "team",
        select: "name title role email",
      })
      .populate({
        path: "activities.by",
        select: "name",
      });

    res.status(200).json({
      status: true,
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const createSubTask = async (req, res) => {
  try {
    const { title, tag, date } = req.body; // Ensure this matches your input structure

    const { id } = req.params; // Task ID from the URL

    const newSubTask = {
      title,
      date,
      tag,
    };

    // Find the task by ID
    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ status: false, message: "Task not found." });
    }

    // Add the new subtask to the task's subTasks array
    task.subTasks.push(newSubTask);

    // Save the task with the new subtask
    await task.save();

    res
      .status(200)
      .json({ status: true, message: "SubTask added successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // Get the entire request body

    const task = await Task.findById(id);

    // Iterate through the keys of the updates object
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        // Handle specific formatting for priority and stage
        if (key === "priority" || key === "stage") {
          task[key] = value.toLowerCase();
        } else {
          task[key] = value; // Update the task property
        }
      }
    }

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Task updated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const trashTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    task.isTrashed = true;

    await task.save();

    res.status(200).json({
      status: true,
      message: `Task trashed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteRestoreTask = async (req, res) => {
  try {
    const { id, actionType } = req.params; // Get actionType from params

    if (actionType === "delete") {
      await Task.findByIdAndUpdate(id, { isTrashed: true });
    } else if (actionType === "deleteAll") {
      await Task.updateMany({}, { isTrashed: true });
    } else if (actionType === "restore") {
      const resp = await Task.findByIdAndUpdate(id, { isTrashed: false });
      if (!resp) {
        return res
          .status(404)
          .json({ status: false, message: "Task not found." });
      }
    } else if (actionType === "restoreAll") {
      await Task.updateMany(
        { isTrashed: true },
        { $set: { isTrashed: false } }
      );
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Invalid action type." });
    }

    res.status(200).json({
      status: true,
      message: `Operation performed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};