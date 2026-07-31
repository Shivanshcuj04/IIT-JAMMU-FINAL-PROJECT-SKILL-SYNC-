const Review = require("../models/Review");
const User = require("../models/User");

// POST /api/reviews   { sessionId, revieweeId, rating, comment }
const leaveReview = async (req, res) => {
  try {
    const { sessionId, revieweeId, rating, comment } = req.body;
    if (!sessionId || !revieweeId || !rating) {
      return res.status(400).json({ message: "sessionId, revieweeId and rating are required" });
    }

    const review = await Review.create({
      session: sessionId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      rating,
      comment,
    });

    const revieweeReviews = await Review.find({ reviewee: revieweeId });
    const avg = revieweeReviews.reduce((sum, r) => sum + r.rating, 0) / revieweeReviews.length;

    const reviewee = await User.findById(revieweeId);
    if (reviewee) {
      reviewee.averageRating = Math.round(avg * 10) / 10;
      reviewee.reviewCount = revieweeReviews.length;
      if (typeof reviewee.refreshBadges === "function") reviewee.refreshBadges();
      await reviewee.save();
    }

    return res.status(201).json({ review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You've already reviewed this session" });
    }
    console.error("Error leaving review:", err);
    return res.status(500).json({ message: "Server error submitting review" });
  }
};

// GET /api/reviews/user/:userId
const getReviewsForUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate("reviewer", "name")
      .sort({ createdAt: -1 });
    return res.status(200).json({ reviews });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return res.status(500).json({ message: "Server error fetching reviews" });
  }
};

module.exports = { leaveReview, getReviewsForUser };
