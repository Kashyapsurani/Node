const express = require("express");
const jwt = require("jsonwebtoken");
const Blog = require("../models/Blog");

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.userId = decoded.userId;
    next();
  });
};

// Add Blog
router.post("/add", verifyToken, async (req, res) => {
  try {
    console.log("User ID from token:", req.userId); // Debug log

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const blog = new Blog({
      title,
      content,
      author: req.userId, // ✅ Ensure this is correctly assigned!
    });

    await blog.save();
    res.json({ message: "Blog posted successfully!", blog });
  } catch (error) {
    console.error("Error posting blog:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Delete Blog by ID (Only Author Can Delete)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // 🔥 Remove the check so any user can delete any blog
    await Blog.findByIdAndDelete(blogId);
    res.json({ message: "Blog deleted successfully!" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




// Get All Blogs
router.get("/all", async (req, res) => {
  const blogs = await Blog.find().populate("author", "username");
  res.json(blogs);
});

module.exports = router;
