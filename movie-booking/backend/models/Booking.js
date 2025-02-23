const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  showtime: { type: String, required: true },
  seats: { type: [String], required: true },
  user: { type: String, required: true },
});

module.exports = mongoose.model("Booking", BookingSchema);
