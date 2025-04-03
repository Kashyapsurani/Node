import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddBlog() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                return;
            }

            const response = await axios.post("http://localhost:3000/api/blogs/add",
                { title: "My Blog", content: "This is a test post." },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Blog added successfully!", response.data);
            setMessage("Blog posted successfully!");
            navigate("/blog");
        } catch (err) {
            setError(err.response?.data?.error || "Error posting blog");
        }
    };

    return (
        <div className="div">
            <h2>Add Blog</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
                <button type="submit">Post Blog</button>
            </form>
        </div>
    );
}

export default AddBlog;
