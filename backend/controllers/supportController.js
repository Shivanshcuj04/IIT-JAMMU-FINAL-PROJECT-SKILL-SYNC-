const SupportTicket = require("../models/SupportTicket");

const createSupportTicket = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const ticket = await SupportTicket.create({ name, email, subject, message });

    return res.status(201).json({
      message: "Your message has been sent. We'll get back to you soon.",
      ticket,
    });
  } catch (err) {
    console.error("Error creating support ticket:", err);
    return res.status(500).json({ message: "Server error submitting your message" });
  }
};

module.exports = { createSupportTicket };
