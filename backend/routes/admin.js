const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/admin");
const contact = require("../controllers/contactController");
router.use(requireAuth, requireAdmin);
router.get("/enquiries", (req, res, next) => { req.isSupportAdmin = true; next(); }, contact.list);
router.patch("/enquiries/:id", contact.update);
module.exports = router;
