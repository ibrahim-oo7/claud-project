const Task = require("../models/Task");

// Create Task
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      deadline,
      projectId,
      assignedTo,
      createdBy,
    } = req.body;

    if (!title || !projectId || !createdBy) {
      return res.status(400).json({
        message: "title, projectId and createdBy are required",
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      deadline,
      projectId,
      assignedTo,
      createdBy,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Error creating task",
      error: error.message,
    });
  }
};

// Get all tasks by project
const getTasksByProject = async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.query;

    const filter = { projectId: req.params.projectId };

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

// Get one task by id
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching task",
      error: error.message,
    });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: "Error updating task",
      error: error.message,
    });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting task",
      error: error.message,
    });
  }
};

// Update task status
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = ["todo", "inprogress", "done"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Use todo, inprogress or done",
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Error updating task status",
      error: error.message,
    });
  }
};

// Assign task to user
const assignTaskToUser = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Error assigning task",
      error: error.message,
    });
  }
};

// Add comment to task
const addCommentToTask = async (req, res) => {
  try {
    const { text, author } = req.body;

    if (!text || !author) {
      return res.status(400).json({
        message: "text and author are required",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.comments.push({ text, author });
    await task.save();

    const updatedTask = await Task.findById(req.params.id);

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: "Error adding comment",
      error: error.message,
    });
  }
};
// upload file 
const uploadFileToTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.attachments.push({
      filename: req.file.filename,
      path: req.file.path,
    });

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Error uploading file",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  assignTaskToUser,
  addCommentToTask,
  uploadFileToTask,
};