const User = require("../models/User");
const Match = require("../models/Match");
const Session = require("../models/Session");
const Report = require("../models/Report");

// GET /api/admin/users?search=&status=blocked|active&role=user|admin
const getAllUsers = async (req, res) => {
  try {
    const { search, status, role } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (status === "blocked") query.isBlocked = true;
    if (status === "active") query.isBlocked = false;
    if (role) query.role = role;

    const users = await User.find(query)
      .select(
        "name email role isBlocked reportCount skills createdAt completedSessionsCount averageRating reviewCount"
      )
      .sort({ reportCount: -1, createdAt: -1 });

    res.json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error fetching users" });
  }
};

// GET /api/admin/users/:id/reports
const getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ reportedUser: req.params.id })
      .populate("reporter", "name email")
      .sort({ createdAt: -1 });
    res.json({ reports });
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ message: "Server error fetching reports" });
  }
};

// PUT /api/admin/users/:id/block
const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") {
      return res.status(400).json({ message: "Admins can't be blocked" });
    }

    user.isBlocked = true;
    await user.save();
    res.json({ message: "User blocked", user });
  } catch (err) {
    console.error("Error blocking user:", err);
    res.status(500).json({ message: "Server error blocking user" });
  }
};

// PUT /api/admin/users/:id/unblock
const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = false;
    await user.save();
    res.json({ message: "User unblocked", user });
  } catch (err) {
    console.error("Error unblocking user:", err);
    res.status(500).json({ message: "Server error unblocking user" });
  }
};

// PUT /api/admin/users/:id/skills/:skillId/verify
// Toggles the verified flag on a single embedded skill
const verifySkill = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const skill = user.skills.id(req.params.skillId);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    skill.verified = !skill.verified;
    await user.save();
    res.json({ skills: user.skills });
  } catch (err) {
    console.error("Error verifying skill:", err);
    res.status(500).json({ message: "Server error verifying skill" });
  }
};

// GET /api/admin/sessions?status=scheduled|completed|cancelled
const getAllSessions = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const sessions = await Session.find(query)
      .populate("participants", "name email")
      .populate("match", "offeredSkillName requestedSkillName")
      .sort({ scheduledAt: -1 })
      .limit(200);

    res.json({ sessions });
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ message: "Server error fetching sessions" });
  }
};

// GET /api/admin/stats
// System health + analytics: counts, top skills, user growth over the last 6 months
const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      blockedUsers,
      adminCount,
      totalMatches,
      pendingMatches,
      acceptedMatches,
      completedMatches,
      totalSessions,
      scheduledSessions,
      completedSessions,
      cancelledSessions,
      pendingReportsCount,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBlocked: true }),
      User.countDocuments({ role: "admin" }),
      Match.countDocuments(),
      Match.countDocuments({ status: "pending" }),
      Match.countDocuments({ status: "accepted" }),
      Match.countDocuments({ status: "completed" }),
      Session.countDocuments(),
      Session.countDocuments({ status: "scheduled" }),
      Session.countDocuments({ status: "completed" }),
      Session.countDocuments({ status: "cancelled" }),
      Report.countDocuments(),
    ]);

    // Top skills across all users' embedded skill lists
    const topSkillsAgg = await User.aggregate([
      { $unwind: "$skills" },
      {
        $group: {
          _id: { name: "$skills.name", type: "$skills.type" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);
    const topSkills = topSkillsAgg.map((s) => ({
      name: s._id.name,
      type: s._id.type,
      count: s.count,
    }));

    // User signups per month, last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const growthAgg = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    // Fill in months with zero signups so the chart doesn't skip gaps
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
    }
    const userGrowth = months.map(({ year, month }) => {
      const found = growthAgg.find((g) => g._id.year === year && g._id.month === month);
      return { label: `${monthNames[month - 1]} ${year}`, count: found ? found.count : 0 };
    });

    res.json({
      overview: {
        totalUsers,
        blockedUsers,
        adminCount,
        totalMatches,
        pendingMatches,
        acceptedMatches,
        completedMatches,
        totalSessions,
        scheduledSessions,
        completedSessions,
        cancelledSessions,
        pendingReportsCount,
      },
      topSkills,
      userGrowth,
    });
  } catch (err) {
    console.error("Error computing admin stats:", err);
    res.status(500).json({ message: "Server error computing stats" });
  }
};

module.exports = {
  getAllUsers,
  getUserReports,
  blockUser,
  unblockUser,
  verifySkill,
  getAllSessions,
  getStats,
};
