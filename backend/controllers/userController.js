const User = require("../models/User");
const { findMatches } = require("../utils/matchingLogic");

// GET /api/users/:id
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
};

// PUT /api/users/me  (update bio, city, timezone, avatar)
const updateProfile = async (req, res) => {
  const { name, bio, city, timezone, avatarUrl } = req.body;
  const user = req.user;

  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (city !== undefined) user.city = city;
  if (timezone !== undefined) user.timezone = timezone;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

  await user.save();
  res.json({ user });
};

// POST /api/users/me/skills  { name, category, level, type, proofUrl }
const addSkill = async (req, res) => {
  const { name, category, level, type, proofUrl } = req.body;
  if (!name || !type) return res.status(400).json({ message: "name and type are required" });

  req.user.skills.push({ name, category, level, type, proofUrl });
  await req.user.save();
  res.status(201).json({ skills: req.user.skills });
};

// DELETE /api/users/me/skills/:skillId
const removeSkill = async (req, res) => {
  req.user.skills = req.user.skills.filter((s) => String(s._id) !== req.params.skillId);
  await req.user.save();
  res.json({ skills: req.user.skills });
};

// PUT /api/users/me/availability  { slots: [{day, startTime, endTime}, ...] }
const setAvailability = async (req, res) => {
  const { slots } = req.body;
  if (!Array.isArray(slots)) return res.status(400).json({ message: "slots must be an array" });
  req.user.availability = slots;
  await req.user.save();
  res.json({ availability: req.user.availability });
};

// GET /api/users/matches  -> mutual-need swap suggestions for the logged-in user
const exploreMatches = async (req, res) => {
  const others = await User.find({ _id: { $ne: req.user._id }, isBlocked: false });
  const matches = findMatches(req.user, others);
  res.json({ matches });
};

module.exports = {
  getUserProfile,
  updateProfile,
  addSkill,
  removeSkill,
  setAvailability,
  exploreMatches,
};
