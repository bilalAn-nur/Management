const express = require("express");
const { signUp, signIn, signOut } = require("../controllers/UserController");
const router = express.Router();
const { loginLimiter } = require("../middleware/rateLimiter");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/signup", signUp);
router.post("/signin", loginLimiter, signIn);
router.post("/signout", signOut);

// Protect Middleware
router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Protected route accessed successfully!" });
});

module.exports = router;
