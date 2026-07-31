const Session = require("../models/Session");
const Match = require("../models/Match");
const User = require("../models/User");

// POST /api/sessions   { matchId, scheduledAt, durationMinutes, meetingLink }
const scheduleSession = async (req, res) => {
  try {
    const { matchId, scheduledAt, durationMinutes, meetingLink } = req.body;

    if (!matchId || !scheduledAt) {
      return res.status(400).json({ message: "matchId and scheduledAt are required" });
    }

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });
    if (match.status !== "accepted") {
      return res.status(400).json({ message: "Match must be accepted before scheduling a session" });
    }

    const session = await Session.create({
      match: match._id,
      participants: [match.requester, match.receiver],
      scheduledAt,
      durationMinutes,
      meetingLink: meetingLink || "https://meet.google.com/placeholder-link",
    });

    return res.status(201).json({ session });
  } catch (err) {
    console.error("Error scheduling session:", err);
    return res.status(500).json({ message: "Server error scheduling session" });
  }
};

// GET /api/sessions/me
const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ participants: req.user._id })
      .populate("match")
      .sort({ scheduledAt: 1 });
    return res.status(200).json({ sessions });
  } catch (err) {
    console.error("Error fetching sessions:", err);
    return res.status(500).json({ message: "Server error fetching sessions" });
  }
};

// PUT /api/sessions/:id/notes   { notes, resources }
const updateSessionNotes = async (req, res) => {
  try {
    const { notes, resources } = req.body;
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (!session.participants.some((p) => String(p) === String(req.user._id))) {
      return res.status(403).json({ message: "Not a participant in this session" });
    }

    if (notes !== undefined) session.notes = notes;
    if (Array.isArray(resources)) session.resources = resources;
    await session.save();

    return res.status(200).json({ session });
  } catch (err) {
    console.error("Error updating session notes:", err);
    return res.status(500).json({ message: "Server error updating session" });
  }
};

// PUT /api/sessions/:id/complete
const completeSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    session.status = "completed";
    await session.save();

    for (const userId of session.participants) {
      const u = await User.findById(userId);
      if (u) {
        u.completedSessionsCount = (u.completedSessionsCount || 0) + 1;
        if (typeof u.refreshBadges === "function") u.refreshBadges();
        await u.save();
      }
    }

    return res.status(200).json({ session });
  } catch (err) {
    console.error("Error completing session:", err);
    return res.status(500).json({ message: "Server error completing session" });
  }
};

module.exports = { scheduleSession, getMySessions, updateSessionNotes, completeSession };
