const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// ✅ Get all bookings
router.get("/", (req, res) => {
  Booking.find()
    .populate("movieId")
    .then((bookings) => res.json(bookings))
    .catch((error) => {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "❌ Server error" });
    });
});

// ✅ Get booked seats for a movie and showtime
router.get("/:movieId/:showtime", (req, res) => {
  const { movieId, showtime } = req.params;

  Booking.find({ movieId, showtime })
    .then((bookings) => {
      const bookedSeats = bookings.flatMap((booking) => booking.seats);
      res.json(bookedSeats);
    })
    .catch((error) => {
      console.error("Error fetching booked seats:", error);
      res.status(500).json({ error: "❌ Server error" });
    });
});

// ✅ Create a new booking
router.post("/", (req, res) => {
  const { movieId, showtime, seats, user } = req.body;

  if (!movieId || !showtime || seats.length === 0 || !user) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newBooking = new Booking({ movieId, showtime, seats, user });
  newBooking
    .save()
    .then((savedBooking) => {
      res
        .status(201)
        .json({ message: "🎉 Booking successful!", booking: savedBooking });
    })
    .catch((error) => {
      console.error("Booking error:", error);
      res.status(500).json({ error: "❌ Server error" });
    });
});

module.exports = router;
