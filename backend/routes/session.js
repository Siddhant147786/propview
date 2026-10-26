const router = require("express").Router();
const controller = require("../controllers/sessionController");
const { requireAuth } = require("../middleware/auth");
router.get("/me", requireAuth, controller.me);
router.patch("/me", requireAuth, controller.update);
router.get("/isloggedin", requireAuth, controller.isLoggedIn);
router.post("/signout", controller.signout);
module.exports = router;
