require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const matchRoutes = require("./routes/matchRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const supportRoutes = require("./routes/support");
const messageRoutes = require("./routes/messageRoutes");

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.get("/", (req, res) => res.json({ status: "SkillSync API running" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/messages", messageRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SkillSync API listening on port ${PORT}`));