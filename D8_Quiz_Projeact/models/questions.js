const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  quizHistory: [
    {
      category: String,
      score: Number,
      total: Number,
    },
  ],
});

// Question Schema
const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: Number, // Index of correct answer
  category: String,
});

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);
const Question = mongoose.model("Question", questionSchema);
const Admin = mongoose.model("Admin", adminSchema);

module.exports = { User, Question, Admin };
