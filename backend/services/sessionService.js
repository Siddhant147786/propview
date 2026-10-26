const jwt = require("jsonwebtoken");
const { isAdmin } = require("../middleware/admin");
const cookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" });
function publicUser(user) { return { _id: user._id, name: user.name, email: user.email, phone: user.phone, createdAt: user.createdAt, isAdmin: isAdmin(user) }; }
function setSession(res, user) {
  const token = jwt.sign({ userId: user._id.toString(), version: user.tokenVersion || 0 }, process.env.JWT_SECRET, { algorithm: "HS256", expiresIn: "24h" });
  res.cookie("token", token, { ...cookieOptions(), maxAge: 24 * 60 * 60 * 1000 });
}
module.exports = { publicUser, setSession, cookieOptions };
