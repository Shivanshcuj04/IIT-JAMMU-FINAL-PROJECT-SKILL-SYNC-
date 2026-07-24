const express = require("express");
const {
  getUserProfile,
  updateProfile,
  addSkill,
  removeSkill,
  setAvailability,
  exploreMatches,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/matches", protect, exploreMatches); // must come before /:id
router.put("/me", protect, updateProfile);
router.post("/me/skills", protect, addSkill);
router.delete("/me/skills/:skillId", protect, removeSkill);
router.put("/me/availability", protect, setAvailability);
router.get("/:id", getUserProfile);

module.exports = router;
