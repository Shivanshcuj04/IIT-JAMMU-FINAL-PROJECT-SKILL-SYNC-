const express = require("express");
const SupportTicket = require("../models/SupportTicket");

const router = express.Router();

// POST /api/support -> submit a new support ticket
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const ticket = await SupportTicket.create({ name, email, subject, message });

    res.status(201).json({
      message: "Your message has been received. We'll get back to you soon.",
      ticket,
    });
  } catch (err) {
    res.status(400).json({ message: "Failed to submit ticket", error: err.message });
  }
});

// GET /api/support -> (optional) list tickets, useful later for an admin view
router.get("/", async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tickets", error: err.message });
  }
});

module.exports = router;
