const User = require("../models/userModel");

exports.getAllUsers = (req, res) => {
  res.render("users", { users: User.getAll() });
};

exports.getUserById = (req, res) => {
  const user = User.getById(req.params.id);
  if (user) {
    res.render("users", { users: [user] });
  } else {
    res.status(404).send("User not found");
  }
};

exports.createUser = (req, res) => {
  // Ensure this function exists
  const newUser = User.create(req.body);
  res.status(201).json(newUser);
};
