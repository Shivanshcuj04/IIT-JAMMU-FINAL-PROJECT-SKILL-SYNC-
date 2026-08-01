const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    trim: true,
    maxlength: 2000,
    default: ""
  },
  fileUrl: { type: String, default: null },   // base64 data URL
  fileName: { type: String, default: null },
  fileType: { type: String, default: null },  // MIME type
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
