const express = require("express");
const {
  scheduleSession,
  getMySessions,
  updateSessionNotes,
  completeSession,
} = require("../controllers/sessionController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, scheduleSession);
router.get("/me", protect, getMySessions);
router.put("/:id/notes", protect, updateSessionNotes);
router.put("/:id/complete", protect, completeSession);

module.exports = router;
