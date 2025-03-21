const Course = require("../models/Coures");

const getCourse = async (req, res) => {
  const course = await Course.find();
  res.json(course);
};

const addCourse = async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.status(201).json({ course: course, message: "data is inserted/created" });
};

const deleteCourse = async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "course is deleted" });
};

const updateCourse = async (req, res) => {
  await Course.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "course is updated" });
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { getCourse, addCourse, deleteCourse, updateCourse,  getCourseById };
