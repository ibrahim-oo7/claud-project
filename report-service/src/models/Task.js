const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: String,
    priority: String,
    status: String,
    projectId: mongoose.Schema.Types.ObjectId,
    assignedTo: mongoose.Schema.Types.ObjectId,
    deadline: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);