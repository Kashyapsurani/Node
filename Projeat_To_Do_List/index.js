const express = require("express");
const app = express();
const port = 5050;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Sample user data
let userTodo = [
  { userId: 1, todo: "Make a project" },
  { userId: 2, todo: "Read a book" },
  { userId: 3, todo: "Go for a walk" },
];


// Route: Home Page (Displays Users)
app.get("/", (req, res) => {
  res.render("index", { userTodo: userTodo });
});

// Route: Insert Data
app.post("/insertTodo", (req, res) => {
  var userId = req.body.userId ? parseInt(req.body.userId) : generateUniqueId();
  var todo = req.body.todo;

  var newUser = { userId, todo };
  userTodo.push(newUser);

  console.log(userTodo);
  res.redirect("/");
});

// Function to generate a unique ID
function generateUniqueId() {
  return userTodo.length > 0
    ? Math.max(...userTodo.map((user) => user.userId)) + 1
    : 1;
}


app.get("/DeleteData", (req, res) => {
  let UserId = req.query.userid;
  let ans = userTodo.filter((item) => {
    return item.userId != UserId;
  });
  userTodo = ans;
  return res.redirect("/");
});

app.get("/EditData", (req, res) => {
  let UserId = req.query.userid;
  let ans = userTodo.filter((item) => {
    return item.userId == UserId;
  });

  if (ans.length === 0) {
    return res.status(404).send("User not found");
  }

  return res.render("edit", { editData: ans[0] });
});




// Start Server
app.listen(port, (error) => {
  if(error) {
    console.log("Error starting server");
  }
  console.log(`Server is running on http://localhost:${port}`);
});
