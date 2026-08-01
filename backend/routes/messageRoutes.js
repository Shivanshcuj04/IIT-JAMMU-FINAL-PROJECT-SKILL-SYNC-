const express = require("express");
const router = express.Router();

const Message = require("../models/Message");
const Match = require("../models/Match");

const { protect } = require("../middleware/auth");

function getMatchUserIds(match) {
  return {
    userA: match.requester ? match.requester.toString() : null,
    userB: match.receiver ? match.receiver.toString() : null
  };
}

function getLoggedInUserId(req) {
  if (!req.user) return null;
  return req.user._id.toString();
}

router.get("/:matchId", protect, async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = getLoggedInUserId(req);
    if (!userId) return res.status(401).json({ message: "User not authenticated" });

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
    return res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    return res.status(500).json({ message: "Server error fetching messages" });
  }
});

router.post("/:matchId", protect, async (req, res) => {
  try {
    const { matchId } = req.params;
    const { text, fileUrl, fileName, fileType } = req.body;
    const userId = getLoggedInUserId(req);
    if (!userId) return res.status(401).json({ message: "User not authenticated" });

    const trimmedText = typeof text === "string" ? text.trim() : "";
    if (!trimmedText && !fileUrl) {
      return res.status(400).json({ message: "Message must include text or a file" });
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
    if (!receiverId) {
      return res.status(400).json({ message: "Unable to determine message receiver" });
    }

    const message = await Message.create({
      matchId,
      sender: userId,
      receiver: receiverId,
      text: trimmedText,
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      fileType: fileType || null,
    });

    return res.status(201).json(message);
  } catch (err) {
    console.error("Error sending message:", err);
    return res.status(500).json({ message: "Server error sending message" });
  }
});

module.exports = router;
