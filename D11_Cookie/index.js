const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const users = [
  { username: "user1", password: "user1" },
  { username: "user2", password: "user2" },
];

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.cookies.authenticated) {
    return next();
  }
  return res.redirect("/login");
};

// Home route
app.get("/", (req, res) => {
  res.render("index");
});

// Login Page
app.get("/login", (req, res) => {
  res.render("login");
});

// Handling Login Request
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    res.cookie("authenticated", true, { httpOnly: true, maxAge: 3600000 });
    res.redirect("/dashboard");
  } else {
    res.send("Invalid credentials. Please try again.");
  }
});

// Dashboard (Protected Route)
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard");
});

// Signup Page
app.get("/signup", (req, res) => {
  res.render("signup");
});

// Logout
app.get("/login", (req, res) => {
  res.clearCookie("authenticated");
  res.redirect("/");
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
