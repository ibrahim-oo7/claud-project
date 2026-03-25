const mongoose = require("mongoose");
const Task = require("../models/Task");

const getTaskStatsByStatus = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(req.params.projectId),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching status stats",
      error: error.message,
    });
  }
};

const getTaskStatsByPriority = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(req.params.projectId),
        },
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching priority stats",
      error: error.message,
    });
  }
};

const getProjectProgress = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({
      projectId: req.params.projectId,
    });

    const doneTasks = await Task.countDocuments({
      projectId: req.params.projectId,
      status: "done",
    });

    const progress = totalTasks === 0 ? 0 : (doneTasks / totalTasks) * 100;

    res.status(200).json({
      totalTasks,
      doneTasks,
      progress: Number(progress.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching project progress",
      error: error.message,
    });
  }
};

const getTaskStatsByUser = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(req.params.projectId),
        },
      },
      {
        $group: {
          _id: "$assignedTo",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user stats",
      error: error.message,
    });
  }
};

module.exports = {
  getTaskStatsByStatus,
  getTaskStatsByPriority,
  getProjectProgress,
  getTaskStatsByUser,
};