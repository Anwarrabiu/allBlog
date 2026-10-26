
const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const authLimiter = require("../middleware/authLimiter");

const router = express.Router();

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/logout", logoutUser);
router.get("/profile", protect, getProfile);

module.exports = router;
