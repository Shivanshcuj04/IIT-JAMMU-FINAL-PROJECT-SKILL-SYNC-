const express = require("express");
const {
  sendMatchRequest,
  getMyMatches,
  respondToMatch,
  completeMatch,
} = require("../controllers/matchController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, sendMatchRequest);
router.get("/me", protect, getMyMatches);
router.put("/:id/respond", protect, respondToMatch);
router.put("/:id/complete", protect, completeMatch);

module.exports = router;
