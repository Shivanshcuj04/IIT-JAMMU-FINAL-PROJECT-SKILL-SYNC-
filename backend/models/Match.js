const mongoose = require("mongoose");

// A Match represents a proposed swap: requester teaches "offeredSkill"
// to receiver, in exchange for learning "requestedSkill" from receiver.
const matchSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    offeredSkillName: { type: String, required: true },
    requestedSkillName: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },

    message: { type: String, maxlength: 300, default: "" },
  },
  { timestamps: true }
);

matchSchema.index({ requester: 1, receiver: 1, offeredSkillName: 1, requestedSkillName: 1 });

module.exports = mongoose.model("Match", matchSchema);
