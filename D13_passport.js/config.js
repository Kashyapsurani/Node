const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");

const user = { id: 1, username: "admin", password: "1234" }; // Dummy user

// Local Strategy for login
passport.use(
  new LocalStrategy((username, password, done) => {
    if (username === user.username && password === user.password) return done(null, user);
    return done(null, false, { message: "Invalid credentials" });
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, user));

// Generate JWT Token
const generateToken = (user) => jwt.sign({ id: user.id, username: user.username }, "secret", { expiresIn: "1h" });

module.exports = { passport, generateToken };
