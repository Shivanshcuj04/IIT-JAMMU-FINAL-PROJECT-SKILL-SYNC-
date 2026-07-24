const Session = require("../models/Session");
const Match = require("../models/Match");

// POST /api/sessions   { matchId, scheduledAt, durationMinutes, meetingLink }
const scheduleSession = async (req, res) => {
  const { matchId, scheduledAt, durationMinutes, meetingLink } = req.body;

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

  res.status(201).json({ session });
};

// GET /api/sessions/me
const getMySessions = async (req, res) => {
  const sessions = await Session.find({ participants: req.user._id })
    .populate("match")
    .sort({ scheduledAt: 1 });
  res.json({ sessions });
};

// PUT /api/sessions/:id/notes   { notes, resources }
const updateSessionNotes = async (req, res) => {
  const { notes, resources } = req.body;
  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).json({ message: "Session not found" });

  if (!session.participants.some((p) => String(p) === String(req.user._id))) {
    return res.status(403).json({ message: "Not a participant in this session" });
  }

  if (notes !== undefined) session.notes = notes;
  if (Array.isArray(resources)) session.resources = resources;
  await session.save();

  res.json({ session });
};

// PUT /api/sessions/:id/complete
const completeSession = async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).json({ message: "Session not found" });

  session.status = "completed";
  await session.save();

  // Bump each participant's completed session count (used for the
  // "Verified Teacher" badge threshold)
  const User = require("../models/User");
  for (const userId of session.participants) {
    const u = await User.findById(userId);
    if (u) {
      u.completedSessionsCount += 1;
      u.refreshBadges();
      await u.save();
    }
  }

  res.json({ session });
};

module.exports = { scheduleSession, getMySessions, updateSessionNotes, completeSession };
