const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");

router.get("/", (_, res) => res.redirect("/register"));

router.get("/login", (_, res) => res.render("login"));
router.get("/register", (_, res) => res.render("register"));

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
 