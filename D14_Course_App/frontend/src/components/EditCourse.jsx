import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditCourse.css";

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState({
        title: "",
        description: "",
        instructor: "",
        rating: "",
        price: "",
    });

    useEffect(() => {
        axios
            .get(`http://localhost:3000/api/course/${id}`)
            .then((res) => {
                const { title, description, instructor, rating, price } = res.data;
                setCourse({
                    title,
                    description,
                    instructor,
                    rating: rating || "",
                    price: price || "",
                });
            })
            .catch((err) => console.error("Error fetching course:", err));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        const updatedCourse = {
            ...course,
            rating: parseFloat(course.rating),
            price: parseFloat(course.price),
        };

        await axios.put(`http://localhost:3000/api/course/${id}`, updatedCourse);
        navigate("/");
    };

    return (
        <div className="p-5">
            <h1 className="text-xl mb-4">Edit Course</h1>
            <div className="edit-form grid grid-cols-1 gap-4 max-w-md">
                {["title", "description", "instructor", "rating", "price"].map((field) => (
                    <div className="form-group" key={field}>
                        <label htmlFor={field} className="block font-semibold mb-1 capitalize">
                            {field}
                        </label>
                        <input
                            id={field}
                            name={field}
                            type={field === "rating" || field === "price" ? "number" : "text"}
                            value={course[field]}
                            onChange={handleChange}
                            className="border p-2 w-full"
                        />
                    </div>
                ))}
                <div className="button-group flex gap-2 mt-4">
                    <button className="bg-green-500 text-white px-4 py-2" onClick={handleUpdate}>
                        Save
                    </button>
                    <button className="bg-gray-400 text-white px-4 py-2" onClick={() => navigate("/courses")}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCourse;
