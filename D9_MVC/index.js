const express = require("express");
const path = require("path");
const app = express();
const port = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Import Models
const User = require("./models/userModel");

// Routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

// Render Home Page with Users List
app.get("/", (req, res) => {
  const users = User.getAll(); // Fetch users from model
  res.render("index", { users });
});

app.use("/users", userRoutes);
app.use("/products", productRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
