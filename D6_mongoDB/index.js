const express = require("express");
const app = express();
const port = 3000;
const db = require("./config/db.js");
const addmin = require("./models/admintbl.js");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


// Route to render index page
app.get("/", (req, res) => {
  addmin
    .find({})
    .then((adddata) => {
      return res.render("index", { data: adddata });
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      return res.send("Error");
    });
});

// Route to handle form submission and insert data
app.post("/insertData", upload.single("image"), (req, res) => {
  const { name, email, password, phone, address } = req.body;

  addmin
    .create({
      name: name,
      email: email,
      password: password,
      phone: phone,
      address: address,
    })
    .then(() => {
      console.log("Data inserted successfully");
      return res.redirect("/");
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      return res.send("Error");
    });
});

// Route to delete data
app.get("/deleteData", (req, res) => {
  let Id = req.query.id;
  addmin
    .findByIdAndDelete(Id)
    .then(() => {
      console.log("Data deleted successfully");
      return res.redirect("/");
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      return res.send("Error");
    });
});

// Route to get edit form
app.get("/editData", (req, res) => {
  const Id = req.query.id;
  addmin.findById(Id).then((user) => {
    if (!user) {
      return res.status(400).send("User not Found");
    }
    return res.render("edit", { user: user });
  });
});

// Route to update data
app.post("/updateData", upload.single("image"), (req, res) => {
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
    .then(() => {
      console.log("Data updated successfully");
      return res.redirect("/");
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      return res.send("Error");
    });
});

app.listen(port, (error) => {
  if (error) {
    console.log(`Error: ${error}`);
    return false;
  }
  console.log(`Server is running on port ${port}`);
});
