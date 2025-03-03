const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/quizDB", {
  // Ensure "quizDB" is correct
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "❌ MongoDB Connection Error:"));
db.once("open", () => {
  console.log("✅ Connected to MongoDB");
});


module.exports = mongoose;
