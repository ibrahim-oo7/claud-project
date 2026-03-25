const express = require("express");
const router = express.Router();

const {
  getTaskStatsByStatus,
  getTaskStatsByPriority,
  getProjectProgress,
  getTaskStatsByUser,
} = require("../controllers/reportController");

router.get("/status/:projectId", getTaskStatsByStatus);
router.get("/priority/:projectId", getTaskStatsByPriority);
router.get("/progress/:projectId", getProjectProgress);
router.get("/user/:projectId", getTaskStatsByUser);

module.exports = router;