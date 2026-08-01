const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// A skill entry embedded inside a user document.
// "type" tells us whether it's something the user can TEACH or wants to LEARN.
const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "Python"
    category: { type: String, default: "General" }, // e.g. "Tech", "Music", "Art"
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Beginner",
    },
    type: { type: String, enum: ["teach", "learn"], required: true },
    proofUrl: { type: String, default: null }, // optional certificate/portfolio link
  },
  { _id: true }
);

const availabilitySlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      required: true,
    },
    startTime: { type: String, required: true }, // "18:00"
    endTime: { type: String, required: true }, // "19:00"
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String, default: null },

    city: { type: String, default: "" },
    timezone: { type: String, default: "" },

    skills: [skillSchema],
    availability: [availabilitySlotSchema],

    bio: { type: String, maxlength: 500, default: "" },
    avatarUrl: { type: String, default: "" },

    completedSessionsCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    badges: [{ type: String, enum: ["Verified Teacher", "Peer Rated", "Master Teacher", "Top Rated"] }],

    role: { type: String, enum: ["user", "admin"], default: "user" },
    isBlocked: { type: Boolean, default: false },
    reportCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash password before saving, only if it changed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Recalculate badges whenever relevant counters change
userSchema.methods.refreshBadges = function () {
  const badges = new Set(this.badges);
  if (this.completedSessionsCount >= 5) badges.add("Verified Teacher");
  if (this.completedSessionsCount >= 20) badges.add("Master Teacher");
  if (this.reviewCount >= 3 && this.averageRating >= 4) badges.add("Peer Rated");
  if (this.reviewCount >= 10) badges.add("Top Rated");
  this.badges = Array.from(badges);
};

module.exports = mongoose.model("User", userSchema);
