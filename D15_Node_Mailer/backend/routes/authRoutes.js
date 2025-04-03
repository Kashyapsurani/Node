const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/logout", logout);

module.exports = router;
