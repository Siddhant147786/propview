const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { User } = require("../models/User");

async function requireAuth(req, res, next) {
  let payload;
  try {
    payload = jwt.verify(req.cookies?.token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    if (!mongoose.isValidObjectId(payload.userId)) throw new Error("Invalid user");
  } catch {
    return res.status(401).json({ message: "Please sign in to continue." });
  }
  try {
    const user = await User.findById(payload.userId).select("name email phone status createdAt tokenVersion");
    if (!user || user.status !== "active" || (payload.version || 0) !== (user.tokenVersion || 0)) {
      return res.status(401).json({ message: "Please sign in with an active account." });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireAuth };
