const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const matchRoutes = require("./routes/matchRoutes");
const messageRoutes = require("./routes/messageRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const supportRoutes = require("./routes/support");

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "8mb" }));

app.get("/", (req, res) => {
  res.json({ message: "SkillSync API is running" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "SkillSync backend is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/support", supportRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
  // Catches oversized/malformed request bodies from express.json()
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large" || err.status === 413) {
    return res.status(413).json({ message: "File is too large (max 4MB)" });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid request format" });
  }
  next(err);
});
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing");
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`SkillSync server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error.message);
    process.exit(1);
  }
};

startServer();
