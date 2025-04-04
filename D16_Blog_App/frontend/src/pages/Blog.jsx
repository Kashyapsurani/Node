import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Blog.css";

function Blog() {
    const [blogs, setBlogs] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/blogs/all");
            setBlogs(response.data);
        } catch (err) {
            setError(err.response?.data?.error || "Error fetching blogs");
        }
    };

    const deleteBlog = async (blogId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            await axios.delete(`http://localhost:3000/api/blogs/${blogId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setBlogs((prevBlogs) => prevBlogs.filter(blog => blog._id !== blogId));
        } catch (error) {
            console.error("Error deleting blog:", error.response?.data || error);
        }
    };

    const handleEdit = (id) => {
        navigate(`/add-blog?id=${id}`);
    };

    return (
        <div className="all-blogs-container">
            <h2 className="blog-title">All Blogs</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="blog-grid">
                {blogs.length > 0 ? (
                    blogs.map((blog, index) => (
                        <div
                            key={blog._id}
                            className="blog-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {blog.image && (
                                <img
                                    src={`http://localhost:3000${blog.image}`}
                                    alt="blog"
                                    className="blog-image"
                                />
                            )}
                            <h3>{blog.title}</h3>
                            <p className="blog-content">{blog.content}</p>
                            <div className="btn-group">
                                <button className="edit-btn" onClick={() => handleEdit(blog._id)}>
                                    Edit
                                </button>
                                <button className="remove-btn" onClick={() => deleteBlog(blog._id)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="error-message">No blogs found.</p>
                )}
            </div>
        </div>
    );
}

export default Blog;
