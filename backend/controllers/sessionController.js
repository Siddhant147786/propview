const { User } = require("../models/User");
const { publicUser, cookieOptions } = require("../services/sessionService");
const { textValue, phoneValue } = require("../utils/validation");
exports.me = (req, res) => {
  res.set("Cache-Control", "no-store"); res.json({ user: publicUser(req.user) });
};
exports.isLoggedIn = (req, res) => {
  res.set("Cache-Control", "no-store"); res.json({ message: "You are signed in." });
};
exports.signout = (req, res) => {
  res.clearCookie("token", cookieOptions()); res.json({ message: "Signed out successfully." });
};
exports.update = async (req, res) => {
  const name = textValue(req.body.name, "Name", 2, 100);
  const phone = phoneValue(req.body.phone);
  const user = await User.findByIdAndUpdate(req.user._id, { $set: { name, phone } }, { returnDocument: "after", runValidators: true });
  res.json({ user: publicUser(user), message: "Profile updated." });
};
