const express = require("express");
const { leaveReview, getReviewsForUser } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, leaveReview);
router.get("/user/:userId", getReviewsForUser);

module.exports = router;
