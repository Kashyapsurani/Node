import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CourseList.css";

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    instructor: "",
    rating: "",
    price: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:3000/api/course");
    setCourses(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/api/course/${id}`);
    fetchCourses();
  };

  const handleAddCourse = async () => {
    const courseToSend = {
      ...newCourse,
      rating: parseFloat(newCourse.rating),
      price: parseFloat(newCourse.price),
    };
    await axios.post("http://localhost:3000/api/course", courseToSend);
    setNewCourse({
      title: "",
      description: "",
      instructor: "",
      rating: "",
      price: "",
    });
    fetchCourses();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
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
        {courses.map((course) => (
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
                className="bg-yellow-500 text-white px-2 py-1 mr-2"
                onClick={() => navigate(`/edit/${course._id}`)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CoursesList;
