const express = require("express");
const Movie = require("../models/Movie");

const router = express.Router();

// ✅ Get all movies
router.get("/", (req, res) => {
  Movie.find()
    .then((movies) => res.json(movies))
    .catch((error) => res.status(500).json({ error: "Server error" }));
});

// ✅ Get movie by ID
router.get("/:id", (req, res) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) return res.status(404).json({ error: "Movie not found" });
      res.json(movie);
    })
    .catch((error) => res.status(500).json({ error: "Server error" }));
});

// ✅ Add a new movie
router.post("/", (req, res) => {
  const { title, genre, poster, showtimes } = req.body;
  const newMovie = new Movie({ title, genre, poster, showtimes });

  newMovie
    .save()
    .then((savedMovie) => res.status(201).json(savedMovie))
    .catch((error) => res.status(500).json({ error: "Server error" }));
});

// ✅ Update a movie
router.put("/:id", (req, res) => {
  Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedMovie) => {
      if (!updatedMovie)
        return res.status(404).json({ error: "Movie not found" });
      res.json(updatedMovie);
    })
    .catch((error) => res.status(500).json({ error: "Server error" }));
});

// ✅ Delete a movie
router.delete("/:id", (req, res) => {
  Movie.findByIdAndDelete(req.params.id)
    .then((deletedMovie) => {
      if (!deletedMovie)
        return res.status(404).json({ error: "Movie not found" });
      res.json({ message: "Movie deleted successfully" });
    })
    .catch((error) => res.status(500).json({ error: "Server error" }));
});

module.exports = router;
