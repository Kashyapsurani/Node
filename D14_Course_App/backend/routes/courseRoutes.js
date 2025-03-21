const express = require("express");
const routes = express.Router();

const {
  getCourse,
  getCourseById, // 👈 Add this
  addCourse,
  deleteCourse,
  updateCourse,
} = require("../Controllers/controllerCourse");

// Get all courses & add new
routes.route("/").get(getCourse).post(addCourse);

// 🔥 Add this GET by ID route
routes.route("/:id").get(getCourseById).put(updateCourse).delete(deleteCourse);

module.exports = routes;
