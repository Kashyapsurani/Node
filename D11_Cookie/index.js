const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const csrf = require("csurf");
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // To handle cookies
app.use(express.static("public")); // Serve static files from the "public" directory
app.set("view engine", "ejs"); // Set EJS as the template engine

// CSRF Protection middleware (This should be used globally or specifically before routes requiring it)
const csrfProtection = csrf({ cookie: true });

// Mock database (this can be replaced by actual DB queries)
let users = [
  {
    username: "user1",
    password: "$2a$10$7G62HkO5UlgrtY7PDBHgWuzm2u18ghqHlX6AiI2y6TlDqdgpTDRuC",
  }, // password1 (hashed)
  {
    username: "user2",
    password: "$2a$10$Y.l2eA2sAXKgRffY8H3CZc/Fjs/Zy6khYO1QfmKhWto/qn4kpD4CC",
  }, // password2 (hashed)
];

// Middleware for checking authentication
const isAuthenticated = (req, res, next) => {
  if (req.cookies.authenticated) {
    return next();
  }
  return res.redirect("/login");
};

// Routes

// Home Route
app.get("/", (req, res) => {
  res.render("index");
});

// Signup Route (GET)
app.get("/signup", csrfProtection, (req, res) => {
  res.render("signup", { csrfToken: req.csrfToken() });
});

// Signup Route (POST)
app.post("/signup", csrfProtection, (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  if (users.find((u) => u.username === username)) {
    return res.send("Username already exists");
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.send("Error hashing password");
    }

    // Add new user to the "database"
    users.push({ username, password: hashedPassword });

    // Log the user in and store their data in a cookie
    res.cookie("authenticated", true, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour cookie
    });
    res.cookie("username", username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour cookie
    });
    res.redirect("/dashboard");
  });
});

// Login Route (GET)
app.get("/login", csrfProtection, (req, res) => {
  res.render("login", { csrfToken: req.csrfToken() });
});

// Login Route (POST)
app.post("/login", csrfProtection, (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (user) {
    // Compare hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.send("Invalid credentials");
      }

      // Log the user in and store their data in a cookie
      res.cookie("authenticated", true, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 hour cookie
      });
      res.cookie("username", username, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 hour cookie
      });
      res.redirect("/dashboard");
    });
  } else {
    res.send("Invalid credentials");
  }
});

// Dashboard Route (Protected)
app.get("/dashboard", isAuthenticated, (req, res) => {
  const username = req.cookies.username;
  res.render("dashboard", { username });
});

// Logout Route
app.get("/logout", (req, res) => {
  res.clearCookie("authenticated");
  res.clearCookie("username");
  res.redirect("/");
});

// Start server
app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
