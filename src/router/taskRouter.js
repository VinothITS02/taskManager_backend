const express = require("express");
const taskRouter = express.Router();
const Task = require("../model/task");

// Send OTP endpoint
taskRouter.post("/createTask", async (req, res) => {
  try {
    const tasks = new Task(req.body);
    tasks.save();
    return res.json({ success: true, message: "Task created successfully!!",data:tasks });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return res.status(500).json({ error: "Failed to create task" });
  }
});


module.exports = taskRouter;
