const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Sample user data
var userdata = [
  {
    userId: 1,
    name: "John",
    email: "Doe@gmail.com",
    password: "1234",
    phone: "1234567890",
  },
  {
    userId: 2,
    name: "Jane",
    email: "Doe@gmail.com",
    password: "1234",
    phone: "1234567890",
  },
  {
    userId: 3,
    name: "Doe",
    email: "Doe@gmail.com",
    password: "1234",
    phone: "1234567890",
  },
];

// Route: Home Page (Displays Users)
app.get("/", (req, res) => {
  res.render("index", { userdata: userdata });
});

// Route: Insert Data
app.post("/insertData", (req, res) => {
  var userId = parseInt(req.body.userId);
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var phone = req.body.phone;

  var newUser = { userId, name, email, password, phone };

  userdata.push(newUser);
  console.log(userdata);

  res.redirect("/");
});

app.get("/DeleteData", (req, res) => {
  let UserId = req.query.userid;
  let ans = userdata.filter((item) => {
    return item.userId != UserId;
  });
  userdata = ans;
  return res.redirect("/");
});

app.get("/EditData", (req, res) => {
  let UserId = req.query.userid;
  let ans = userdata.filter((item) => {
    return item.userId == UserId;
  });
  return res.render("edit", {
    editData: ans[0],
  });
});

// Start Server
app.listen(port, (error) => {
  if (error) {
    console.log("Error running the server");
  }
  console.log("Server is running on port", port);
});
