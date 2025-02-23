const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  poster: String,
  showtimes: [String],
});

module.exports = mongoose.model("Movie", movieSchema);
