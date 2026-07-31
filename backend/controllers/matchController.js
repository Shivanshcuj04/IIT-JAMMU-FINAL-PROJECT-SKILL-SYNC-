const Match = require("../models/Match");

// POST /api/matches   { receiverId, offeredSkillName, requestedSkillName, message }
const sendMatchRequest = async (req, res) => {
  try {
    const { receiverId, offeredSkillName, requestedSkillName, message } = req.body;
    if (!receiverId || !offeredSkillName || !requestedSkillName) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (String(receiverId) === String(req.user._id)) {
      return res.status(400).json({ message: "Cannot match with yourself" });
    }

    // Block a new request if an active one already exists between these two,
    // in either direction — this is what was letting duplicates through.
    const existing = await Match.findOne({
      status: { $in: ["pending", "accepted"] },
      $or: [
        { requester: req.user._id, receiver: receiverId },
        { requester: receiverId, receiver: req.user._id },
      ],
    });
    if (existing) {
      return res.status(409).json({ message: "You already have an active request with this user" });
    }

    const match = await Match.create({
      requester: req.user._id,
      receiver: receiverId,
      offeredSkillName,
      requestedSkillName,
      message,
    });

    return res.status(201).json({ match });
  } catch (err) {
    console.error("Error sending match request:", err);
    return res.status(500).json({ message: "Server error sending match request" });
  }
};

// GET /api/matches/me
const getMyMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ requester: req.user._id }, { receiver: req.user._id }],
    })
      .populate("requester", "name city averageRating")
      .populate("receiver", "name city averageRating")
      .sort({ createdAt: -1 });

    return res.status(200).json({ matches });
  } catch (err) {
    console.error("Error fetching matches:", err);
    return res.status(500).json({ message: "Server error fetching matches" });
  }
};

// PUT /api/matches/:id/respond   { status: "accepted" | "rejected" }
const respondToMatch = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "status must be accepted or rejected" });
    }

    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });
    if (String(match.receiver) !== String(req.user._id)) {
      return res.status(403).json({ message: "Only the receiver can respond to this match" });
    }

    match.status = status;
    await match.save();
    return res.status(200).json({ match });
  } catch (err) {
    console.error("Error responding to match:", err);
    return res.status(500).json({ message: "Server error responding to match" });
  }
};

// PUT /api/matches/:id/complete
const completeMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });

    const isParticipant =
      String(match.requester) === String(req.user._id) || String(match.receiver) === String(req.user._id);
    if (!isParticipant) return res.status(403).json({ message: "Not a participant in this match" });

    match.status = "completed";
    await match.save();
    return res.status(200).json({ match });
  } catch (err) {
    console.error("Error completing match:", err);
    return res.status(500).json({ message: "Server error completing match" });
  }
};

module.exports = { sendMatchRequest, getMyMatches, respondToMatch, completeMatch };
