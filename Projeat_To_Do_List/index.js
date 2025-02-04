const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Sample user data
let userTodo = [
  { todoId: 1, todo: "Make a project" },
  { todoId: 2, todo: "Read a book" },
  { todoId: 3, todo: "Go for a walk" },
];

// Route: Home Page (Displays Users)
app.get("/", (req, res) => {
  res.render("index", {
    userTodo: userTodo,
  });
});

// Route: Insert Data
app.post("/insertTodo", (req, res) => {
  let todo = req.body.todo;
    let newId = userTodo.length > 0 ? userTodo[userTodo.length - 1].todoId + 1 : 1;
    userTodo.push({ todoId: newId, todo: todo });
  res.redirect("/");

});

// Route: Delete Data
app.post("/deleteTodo", (req, res) => {
  let id = parseInt(req.body.todoId); // Get todoId from form body
  userTodo = userTodo.filter((user) => user.todoId !== id);
  res.redirect("/");
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
