const express = require("express");
const app = express();
const port = 3000;
const db = require("./config/db");
const addmin = require("./models/admintbl.js");
app.set("view engine", "ejs");
app.use(express.urlencoded());

app.get("/", (req, res) => {
  addmin
    .find({})
    .then((adddata) => {
      return res.render("index", {
        data: adddata,
      });
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      return res.send("Error");
    });
});

app.post("/insertData", (req, res) => {
  const { name, email, password, phone, address } = req.body;
  addmin
    .create({
      name: name,
      email: email,
      password: password,
      phone: phone,
      address: address,
    })
    .then((data) => {
      console.log("data inserted successfully");
      return res.redirect("/");
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      return res.send("Error");
    });
});

app.get("/deleteData", (req, res) => {
  let Id = req.query.id;
  addmin
    .findByIdAndDelete(Id)
    .then((data) => {
      console.log("data deleted successfully");
      return res.redirect("/");
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      return res.send("Error");
    });
});

app.get("/editData", (req, res) => {
  const Id = req.query.id;
  addmin.findById(Id).then((user) => {
    if (!user) {
      return res.status(400).send("user not Found");
    }
    return res.render("edit", {
      user: user,
    });
  });
});

app.post("/updateData", (req, res) => {
  const Id = req.query.id;
  const { name, email, password, phone, address } = req.body;
  addmin
    .findByIdAndUpdate(Id, {
      name: name,
      email: email,
      password: password,
      phone: phone,
      address: address,
    })
    .then((data) => {
      console.log("Data Uplode");
      return res.redirect('/')
    })
    .catch((errr) => {
      console.log(errr);
    });
});

app.listen(port, (error) => {
  if (error) {
    console.log(`Error: ${error}`);
    return false;
  }
  console.log(`Server is running on port ${port}`);
});
