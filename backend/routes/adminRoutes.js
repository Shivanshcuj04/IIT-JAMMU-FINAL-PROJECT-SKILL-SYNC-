const express = require("express");
const {
  getAllUsers,
  getUserReports,
  blockUser,
  unblockUser,
  verifySkill,
  getAllSessions,
  getStats,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// Every route below requires a logged-in admin
router.use(protect, adminOnly);

router.get("/stats", getStats);

router.get("/users", getAllUsers);
router.get("/users/:id/reports", getUserReports);
router.put("/users/:id/block", blockUser);
router.put("/users/:id/unblock", unblockUser);
router.put("/users/:id/skills/:skillId/verify", verifySkill);

router.get("/sessions", getAllSessions);

module.exports = router;
