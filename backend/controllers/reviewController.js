const Review = require("../models/Review");
const User = require("../models/User");

// POST /api/reviews   { sessionId, revieweeId, rating, comment }
const leaveReview = async (req, res) => {
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

  // Recalculate the reviewee's average rating
  const revieweeReviews = await Review.find({ reviewee: revieweeId });
  const avg =
    revieweeReviews.reduce((sum, r) => sum + r.rating, 0) / revieweeReviews.length;

  const reviewee = await User.findById(revieweeId);
  reviewee.averageRating = Math.round(avg * 10) / 10;
  reviewee.reviewCount = revieweeReviews.length;
  reviewee.refreshBadges();
  await reviewee.save();

  res.status(201).json({ review });
};

// GET /api/reviews/user/:userId
const getReviewsForUser = async (req, res) => {
  const reviews = await Review.find({ reviewee: req.params.userId })
    .populate("reviewer", "name")
    .sort({ createdAt: -1 });
  res.json({ reviews });
};

module.exports = { leaveReview, getReviewsForUser };
