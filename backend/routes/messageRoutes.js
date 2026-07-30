const express = require("express");
const router = express.Router();

const Message = require("../models/Message");
const Match = require("../models/Match");

// Correct authentication middleware
const { protect } = require("../middleware/auth");


// -----------------------------------------------------
// Helper: Get both users from a match
// -----------------------------------------------------

function getMatchUserIds(match) {
  return {
    userA: match.requester
      ? match.requester.toString()
      : null,

    userB: match.recipient
      ? match.recipient.toString()
      : null
  };
}


// -----------------------------------------------------
// Helper: Get logged-in user's ID
// -----------------------------------------------------

function getLoggedInUserId(req) {

  if (!req.user) {
    return null;
  }

  return req.user._id.toString();
}


// -----------------------------------------------------
// GET MESSAGES
// GET /api/messages/:matchId
// -----------------------------------------------------

router.get("/:matchId", protect, async (req, res) => {

  try {

    const { matchId } = req.params;

    const userId = getLoggedInUserId(req);


    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }


    // Find match
    const match = await Match.findById(matchId);


    if (!match) {
      return res.status(404).json({
        message: "Match not found"
      });
    }


    // Get both users
    const { userA, userB } = getMatchUserIds(match);


    // Verify logged-in user belongs to this match
    if (![userA, userB].includes(userId)) {

      return res.status(403).json({
        message: "Not authorized for this chat"
      });

    }


    // Chat available only after match acceptance
    if (match.status !== "accepted") {

      return res.status(403).json({
        message: "Chat unlocks once the match is accepted"
      });

    }


    // Get messages
    const messages = await Message
      .find({ matchId })
      .sort({ createdAt: 1 });


    return res.status(200).json(messages);


  } catch (err) {

    console.error(
      "Error fetching messages:",
      err
    );


    return res.status(500).json({
      message: "Server error fetching messages"
    });

  }

});


// -----------------------------------------------------
// SEND MESSAGE
// POST /api/messages/:matchId
// -----------------------------------------------------

router.post("/:matchId", protect, async (req, res) => {

  try {

    const { matchId } = req.params;

    const { text } = req.body;

    const userId = getLoggedInUserId(req);


    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }


    // Validate message
    if (
      !text ||
      typeof text !== "string" ||
      !text.trim()
    ) {

      return res.status(400).json({
        message: "Message cannot be empty"
      });

    }


    // Find match
    const match = await Match.findById(matchId);


    if (!match) {

      return res.status(404).json({
        message: "Match not found"
      });

    }


    // Get users from match
    const { userA, userB } = getMatchUserIds(match);


    // Check authorization
    if (![userA, userB].includes(userId)) {

      return res.status(403).json({
        message: "Not authorized for this chat"
      });

    }


    // Match must be accepted
    if (match.status !== "accepted") {

      return res.status(403).json({
        message: "Chat unlocks once the match is accepted"
      });

    }


    // Determine receiver
    const receiverId =
      userId === userA
        ? userB
        : userA;


    if (!receiverId) {

      return res.status(400).json({
        message: "Unable to determine message receiver"
      });

    }


    // Create message
    const message = await Message.create({

      matchId: matchId,

      sender: userId,

      receiver: receiverId,

      text: text.trim()

    });


    return res.status(201).json(message);


  } catch (err) {

    console.error(
      "Error sending message:",
      err
    );


    return res.status(500).json({
      message: "Server error sending message"
    });

  }

});


module.exports = router;
