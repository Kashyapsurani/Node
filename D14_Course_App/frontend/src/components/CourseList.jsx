import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, addCourse, deleteCourse } from "../features/course/courseSlice";
import { useNavigate } from "react-router-dom";
import "./CourseList.css";

const CoursesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { courses, status, error } = useSelector((state) => state.course);

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    instructor: "",
    rating: "",
    price: "",
  });

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = () => {
    const courseToSend = {
      ...newCourse,
      rating: parseFloat(newCourse.rating),
      price: parseFloat(newCourse.price),
    };
    dispatch(addCourse(courseToSend));
    setNewCourse({
      title: "",
      description: "",
      instructor: "",
      rating: "",
      price: "",
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteCourse(id));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Courses</h1>

      <div className="course-form">
        {["title", "description", "instructor", "rating", "price"].map((field) => (
          <div key={field} className="form-group">
            <label htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              id={field}
              name={field}
              type={field === "rating" || field === "price" ? "number" : "text"}
              placeholder={`Enter ${field}`}
              value={newCourse[field]}
              onChange={handleChange}
            />
          </div>
        ))}
        <button className="add-button" onClick={handleAddCourse}>
          Add Course
        </button>
      </div>

      <div className="course-cards-container">
        {status === "loading" && <p>Loading courses...</p>}
        {status === "failed" && <p>Error: {error}</p>}
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <div key={course._id} className="course-card">
              <h2 className="text-lg font-bold">{course.title}</h2>
              <p><strong>Description:</strong> {course.description}</p>
              <p><strong>Instructor:</strong> {course.instructor}</p>
              <p><strong>Rating:</strong> {course.rating}</p>
              <p><strong>Price:</strong> ${course.price}</p>
              <div className="mt-2">
                <button
                  className="bg-red-500 text-white px-2 py-1"
                  onClick={() => handleDelete(course._id)}
                >
                  Delete
                </button>
                <button
                  className="bg-yellow-500 text-white px-2 py-1 ml-2"
                  onClick={() => navigate(`/edit/${course._id}`)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No courses available.</p>
        )}
      </div>
    </div>
  );
};

export default CoursesList;
