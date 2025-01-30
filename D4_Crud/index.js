const express = require("express");
const port = 3000;
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded());

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

app.get("/", (req, res) => {
  res.render("index", {
    userdata: userdata
  });
});

app.post("/insertData", (req, res) => {
  var userId = req.body.userId;
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var phone = req.body.phone;

  var data = {
    userId: userId,
    name: name,
    email: email,
    password: password,
    phone: phone,
  };
  userdata.push(data);
  res.redirect("/"); 
});

app.listen(port, (error) => {
  if(error) {
    console.log("Error running the server");
  }
  console.log("Server is running on port", port);
})
