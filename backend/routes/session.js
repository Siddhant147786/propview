const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");

router.get("/me", requireAuth, (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ user: req.user });
});

router.post("/signout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  res.json({ message: "Signed out successfully." });
});

module.exports = router;
