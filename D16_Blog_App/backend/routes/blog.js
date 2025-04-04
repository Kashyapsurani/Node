const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const Blog = require("../models/Blog");

const router = express.Router();

// 📸 Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// 🔐 JWT Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.userId = decoded.userId;
    next();
  });
};

// 📥 POST: Add Blog
router.post("/add", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const blog = new Blog({ title, content, image, author: req.userId });
    await blog.save();
    res.json({ message: "Blog posted successfully!", blog });
  } catch (err) {
    console.error("Add Blog Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✏️ PUT: Update Blog
router.put("/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ error: "Invalid blog ID format" });
    }

    const updateFields = { title, content };
    if (req.file) updateFields.image = `/uploads/${req.file.filename}`;

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateFields, {
      new: true,
    });

    if (!updatedBlog) return res.status(404).json({ error: "Blog not found" });

    res.json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (err) {
    console.error("Update Blog Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 📚 GET: All Blogs
router.get("/all", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "username"); // Optional: populate author
    res.json(blogs);
  } catch (err) {
    console.error("Error getting all blogs:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔍 GET: Single Blog by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid blog ID format" });
  }

  try {
    const blog = await Blog.findById(id).populate("author", "username");
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error("Get Blog Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid blog ID format" });
  }

  try {
    const blog = await Blog.findById(id);

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Optional: Check if current user is the author
    if (blog.author.toString() !== req.userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this blog" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Delete Blog Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
