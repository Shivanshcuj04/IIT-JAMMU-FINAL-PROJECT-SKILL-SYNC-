const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Match = require("../models/Match");
const authMiddleware = require("../middleware/authMiddleware"); // ⚠️ adjust filename if yours is named differently

// ⚠️ Only edit this if your Match model's two user fields aren't named
// requester/recipient (e.g. fromUser/toUser, user1/user2...)
function getMatchUserIds(match) {
  return {
    userA: match.requester?.toString(),
    userB: match.recipient?.toString()
  };
}

function getLoggedInUserId(req) {
  return req.user.id || req.user._id?.toString(); // ⚠️ adjust if your authMiddleware sets req.user differently
}

router.get("/:matchId", authMiddleware, async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = getLoggedInUserId(req);

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });

    const { userA, userB } = getMatchUserIds(match);
    if (![userA, userB].includes(userId)) {
      return res.status(403).json({ message: "Not authorized for this chat" });
    }
    if (match.status !== "accepted") {
      return res.status(403).json({ message: "Chat unlocks once the match is accepted" });
    }

    const messages = await Message.find({ matchId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching messages" });
  }
});

router.post("/:matchId", authMiddleware, async (req, res) => {
  try {
    const { matchId } = req.params;
    const { text } = req.body;
    const userId = getLoggedInUserId(req);

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });

    const { userA, userB } = getMatchUserIds(match);
    if (![userA, userB].includes(userId)) {
      return res.status(403).json({ message: "Not authorized for this chat" });
    }
    if (match.status !== "accepted") {
      return res.status(403).json({ message: "Chat unlocks once the match is accepted" });
    }

    const receiverId = userId === userA ? userB : userA;

    const message = await Message.create({
      matchId,
      sender: userId,
      receiver: receiverId,
      text: text.trim()
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error sending message" });
  }
});

module.exports = router;