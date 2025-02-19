const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Ensure the correct path

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser); // Ensure this function exists

module.exports = router;
