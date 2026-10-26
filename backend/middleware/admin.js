function isAdmin(user) {
  const emails = (process.env.ADMIN_EMAILS || "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  return Boolean(user?.email && emails.includes(user.email.toLowerCase()));
}
function requireAdmin(req, res, next) {
  if (!isAdmin(req.user)) return res.status(403).json({ message: "Administrator access is required." });
  next();
}
module.exports = { isAdmin, requireAdmin };
