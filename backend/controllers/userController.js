const User = require("../models/User");
const Report = require("../models/Report");
const { findMatches } = require("../utils/matchingLogic");

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
};

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

const addSkill = async (req, res) => {
  const { name, category, level, type, proofUrl } = req.body;
  if (!name || !type) return res.status(400).json({ message: "name and type are required" });

  req.user.skills.push({ name, category, level, type, proofUrl });
  await req.user.save();
  res.status(201).json({ skills: req.user.skills });
};

const removeSkill = async (req, res) => {
  req.user.skills = req.user.skills.filter((s) => String(s._id) !== req.params.skillId);
  await req.user.save();
  res.json({ skills: req.user.skills });
};

const setAvailability = async (req, res) => {
  const { slots } = req.body;
  if (!Array.isArray(slots)) return res.status(400).json({ message: "slots must be an array" });
  req.user.availability = slots;
  await req.user.save();
  res.json({ availability: req.user.availability });
};

const exploreMatches = async (req, res) => {
  const others = await User.find({ _id: { $ne: req.user._id }, isBlocked: false });
  const matches = findMatches(req.user, others);
  res.json({ matches });
};

// POST /api/users/:id/report   { reason, sessionId }
const reportUser = async (req, res) => {
  try {
    const { reason, sessionId } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: "Please describe the issue" });
    }
    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({ message: "You can't report yourself" });
    }

    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: "User not found" });

    await Report.create({
      reporter: req.user._id,
      reportedUser: target._id,
      session: sessionId || null,
      reason: reason.trim(),
    });

    target.reportCount = (target.reportCount || 0) + 1;
    if (target.reportCount >= 5) target.isBlocked = true;
    await target.save();

    return res.status(201).json({ message: "Report submitted. Thank you for helping keep SkillSync safe." });
  } catch (err) {
    console.error("Error reporting user:", err);
    return res.status(500).json({ message: "Server error submitting report" });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  addSkill,
  removeSkill,
  setAvailability,
  exploreMatches,
  reportUser,
};
