const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authentication middleware
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user using the decoded token
      User.findById(decoded.id)
        .then((user) => {
          if (!user) {
            return res.redirect("/login"); // Redirect if user not found
          }
          // Attach user info to the request object for further use
          req.user = user;
          next(); // Proceed to the requested route
        })
        .catch((err) => {
          console.error(err);
          res.redirect("/login");
        });
    } catch (err) {
      console.error(err);
      res.redirect("/login"); // Redirect if the token is invalid
    }
  } else {
    res.redirect("/login"); // Redirect if no token is present
  } 
};

// Role checking middleware
module.exports.checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res
        .status(403)
        .send("Forbidden: You don't have the required role");
    }
    next();
  };
};
