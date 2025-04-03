import { useEffect, useState } from "react";
import axios from "axios";
import "./Blog.css";  // ✅ Import the CSS file

function Blog() {
    const [blogs, setBlogs] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3000/api/blogs/all")
            .then((response) => setBlogs(response.data))
            .catch((err) => setError(err.response?.data?.error || "Error fetching blogs"));
    }, []);

    const deleteBlog = async (blogId) => {
        try {
            const token = localStorage.getItem("token");  // Retrieve token
            if (!token) {
                console.error("No token found");
                return;
            }

            const response = await axios.delete(`http://localhost:3000/api/blogs/${blogId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Blog deleted:", response.data);
            setBlogs(blogs.filter(blog => blog._id !== blogId)); // Update U
        } catch (error) {
            console.error("Error deleting blog:", error.response?.data || error);
        }
    };


    return (
        <div className="all-blogs-container">
            <h2>All Blogs</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="blog-grid">
                {blogs.length > 0 ? (
                    blogs.map((blog, index) => (
                        <div key={blog._id} className="blog-card" style={{ animationDelay: `${index * 0.1}s` }}>
                            <h3>{blog.title}</h3>
                            <p className="blog-content">{blog.content}</p>
                            <button className="remove-btn" onClick={() => deleteBlog(blog._id)}>Remove</button>
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
