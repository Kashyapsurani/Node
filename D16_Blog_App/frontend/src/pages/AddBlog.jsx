import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

function AddBlog() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);

    const [searchParams] = useSearchParams();
    const blogId = searchParams.get("id");
    const navigate = useNavigate();

    useEffect(() => {
        if (blogId) {
            setIsEditMode(true);
            fetchBlogDetails(blogId);
        }
    }, [blogId]);

    const fetchBlogDetails = async (id) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/blogs/${id}`);
            const { title, content, image } = res.data;
            setTitle(title);
            setContent(content);
            setExistingImage(image); // saved path to display
        } catch (err) {
            setError("Error fetching blog data");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const token = localStorage.getItem("token");
        if (!token) {
            setError("No token found. Please login.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if (image) formData.append("image", image);

        try {
            if (isEditMode) {
                await axios.put(`http://localhost:3000/api/blogs/${blogId}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMessage("Blog updated successfully!");
            } else {
                await axios.post("http://localhost:3000/api/blogs/add", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMessage("Blog posted successfully!");
            }

            navigate("/blog");
        } catch (err) {
            console.error("Error submitting blog:", err);
            setError(err.response?.data?.error || "Error submitting blog");
        }
    };

    return (
        <div className="add-blog-container">
            <h2>{isEditMode ? "Edit Blog" : "Add Blog"}</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                {isEditMode && existingImage && !image && (
                    <div style={{ marginTop: "10px" }}>
                        <p>Current Image:</p>
                        <img
                            src={`http://localhost:3000${existingImage}`}
                            alt="blog preview"
                            style={{ maxWidth: "300px", borderRadius: "8px" }}
                        />
                    </div>
                )}
                <button type="submit">{isEditMode ? "Update Blog" : "Post Blog"}</button>
            </form>
        </div>
    );
}

export default AddBlog;
