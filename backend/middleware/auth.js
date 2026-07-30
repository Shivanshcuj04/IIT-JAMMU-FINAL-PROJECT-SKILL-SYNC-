const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes using JWT
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if token exists and uses Bearer format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, no token"
      });
    }

    // Get token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists"
      });
    }

    // Check blocked account
    if (user.isBlocked) {
      return res.status(403).json({
        message: "Account is blocked"
      });
    }

    // Attach user to request
    req.user = user;

    next();

  } catch (err) {
    console.error("Authentication error:", err.message);

    return res.status(401).json({
      message: "Not authorized, token invalid"
    });
  }
};


// Admin-only middleware
// Always use after protect
const adminOnly = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required"
    });
  }

  next();
};


module.exports = {
  protect,
  adminOnly
};
