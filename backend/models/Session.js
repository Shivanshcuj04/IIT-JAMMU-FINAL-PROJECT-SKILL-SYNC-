const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    match: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],

    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 60 },
    meetingLink: { type: String, default: "" }, // Zoom/Meet URL or placeholder

    notes: { type: String, default: "" },
    resources: [{ title: String, url: String }], // shared resource vault

    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
