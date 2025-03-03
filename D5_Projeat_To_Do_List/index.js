const express = require("express");
const app = express();
const port = 5050;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files like CSS

// In-memory data for todos
let userTodo = [
  { userId: 1, todo: "Watch a movie" },
  { userId: 2, todo: "Read a book" },
  { userId: 3, todo: "Go for a walk" },
];

// Home route to display todos
app.get("/", (req, res) => {
  res.render("index", { userTodo: userTodo });
});

// Insert new todo or update existing one
app.post("/insertTodo", (req, res) => {
  let editid = req.body.userId;
  let todo = req.body.todo;

  if (editid) {
    // Update existing todo
    const index = userTodo.findIndex((item) => item.userId == editid);

    if (index !== -1) {
      userTodo[index].todo = todo; // Update the todo
      console.log("Record Successfully Updated");
    } else {
      console.log("Record not found for update");
    }
    return res.redirect("/");
  } else {
    // Add new todo
    let obj = {
      userId: generateUniqueId(),
      todo: todo,
    };
    userTodo.push(obj);
    return res.redirect("/");
  }
});

// Generate unique ID for new todos
function generateUniqueId() {
  return userTodo.length > 0
    ? Math.max(...userTodo.map((user) => user.userId)) + 1
    : 1;
}

// Delete todo by userId
app.get("/DeleteData", (req, res) => {
  let UserId = req.query.userid;
  userTodo = userTodo.filter((item) => item.userId != UserId);
  return res.redirect("/");
});

// Edit todo by userId
app.get("/EditData", (req, res) => {
  let UserId = req.query.userid;
  const editData = userTodo.find((item) => item.userId == UserId);

  if (editData) {
    res.render("edit", { editData: editData });
  } else {
    res.redirect("/");
  }
});

// Start server
app.listen(port, (error) => {
  if (error) {
    console.log("Error starting server");
  }
  console.log(`Server is running on http://localhost:${port}`);
});
