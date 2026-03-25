const express = require("express");
const router = express.Router();
const upload = require("../config/upload");

const {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  assignTaskToUser,
  addCommentToTask,
  uploadFileToTask,
} = require("../controllers/taskController");

router.post("/", createTask);
router.get("/project/:projectId", getTasksByProject);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

router.patch("/:id/status", updateTaskStatus);
router.patch("/:id/assign", assignTaskToUser);
router.post("/:id/comments", addCommentToTask);

router.post("/:id/upload", upload.single("file"), uploadFileToTask);

module.exports = router;