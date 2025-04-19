const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username: req.body.username });

    if (existingUser) {
      // If username exists, render the registration page again with an error message
      return res.render("register", {
        errorMessage: "Username already exists. Please choose a different one.",
      });
    }

    // If username doesn't exist, create the new user
    await User.create(req.body);
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error. Please try again later.");
  }
};




exports.login = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    console.log(user);
    console.log(user);
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.cookie("token", token).redirect("/products");
  } else {
    res.send("Invalid credentials");
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token").redirect("/login");
};
