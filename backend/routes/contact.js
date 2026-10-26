const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { rateLimit } = require("../middleware/rateLimit");
router.get("/", requireAuth, require("../controllers/contactController").list);
router.post("/", requireAuth, rateLimit(5, 3600000), require("../controllers/contactController").create);
module.exports = router;
