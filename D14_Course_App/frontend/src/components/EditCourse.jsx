import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseById, updateCourse } from "../features/course/courseSlice";
import "./EditCourse.css";

const EditCourse = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { selectedCourse } = useSelector((state) => state.course);

    const [course, setCourse] = useState({
        title: "",
        description: "",
        instructor: "",
        rating: "",
        price: "",
    });

    useEffect(() => {
        dispatch(fetchCourseById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedCourse) {
            setCourse({
                title: selectedCourse.title || "",
                description: selectedCourse.description || "",
                instructor: selectedCourse.instructor || "",
                rating: selectedCourse.rating || "",
                price: selectedCourse.price || "",
            });
        }
    }, [selectedCourse]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = () => {
        dispatch(updateCourse({ id, updatedData: course }));
        navigate("/courses");
    };

    return (
        <div className="p-5">
            <h1>Edit Course</h1>
            <div className="edit-form">
                {["title", "description", "instructor", "rating", "price"].map((field) => (
                    <div className="form-group" key={field}>
                        <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input
                            id={field}
                            name={field}
                            type={field === "rating" || field === "price" ? "number" : "text"}
                            value={course[field]}
                            onChange={handleChange}
                            step={field === "rating" ? "0.1" : "any"}
                            min={field === "rating" ? "0" : undefined}
                            max={field === "rating" ? "5" : undefined}
                        />
                    </div>
                ))}
                <div className="button-group">
                    <button className="bg-green-500" onClick={handleUpdate}>
                        Save
                    </button>
                    <button className="bg-gray-400" onClick={() => navigate("/courses")}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCourse;
