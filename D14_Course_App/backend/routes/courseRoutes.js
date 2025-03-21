const express =require('express')

const routes =express.Router()

const {
  getCourse,
  addCourse,
  deleteCourse,
  updateCourse,
} = require("../Controllers/controllerCourse");

routes.route('/').get(getCourse).post(addCourse)

routes.route('/:id').delete(deleteCourse).put(updateCourse)


module.exports= routes