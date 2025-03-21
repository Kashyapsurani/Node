const express = require("express");
const session = require("express-session");
const { passport, generateToken } = require("./config");
const authMiddleware = require("./auth");
const app = express();
app.use(express.json());
app.use(session({ secret: "mySecret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");
app.use(express.urlencoded()); 


const cookieParser = require("cookie-parser");
app.use(cookieParser());
// 🔹 LOGIN ROUTE using `app.route()`

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post(passport.authenticate("local"), (req, res) => {
    const token = generateToken(req.user);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  });

// 🔹 DASHBOARD ROUTE (Protected)

// 🔹 DASHBOARD ROUTE (Protected)
app.route("/dashboard").get(authMiddleware, (req, res) => {
  res.render("dashboard", { user: req.user }); // Optional: Pass user to the template
});


// 🔹 LOGOUT ROUTE using `app.route()`
app.route("/logout").get((req, res) => {
  res.clearCookie("token");
  req.logout(() => res.redirect("/login"));
});

// Start Server
app.listen(8000, () => console.log("Server running on http://localhost:8000"));
