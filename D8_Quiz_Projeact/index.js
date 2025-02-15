const express = require("express");
const mongoose = require("mongoose");
const { User, Question, Admin } = require("./models/questions");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017/quizDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let loggedInUser = null;
let loggedInAdmin = null;

const client = new MongoClient("mongodb://localhost:27017");
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("quizApp");
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

connectDB();

// Ensure Admin Exists
async function createAdmin() {
  const existingAdmin = await Admin.findOne({ username: "admin" });
  if (!existingAdmin) {
    await Admin.create({ username: "admin", password: "admin123" });
    console.log("✅ Admin Created!");
  } else {
    console.log("✅ Admin Already Exists!");
  }
}
createAdmin();

// Middleware for Authentication
function isAuthenticated(req, res, next) {
  if (loggedInUser) return next();
  res.redirect("/login");
}

function isAdmin(req, res, next) {
  if (loggedInAdmin) return next();
  res.redirect("/admin/login");
}

// Routes
app.get("/", (req, res) => res.render("index"));

app.get("/register", (req, res) => res.render("register"));
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (await User.findOne({ username })) return res.send("Username exists!");

  await new User({ username, password, quizHistory: [] }).save();
  res.redirect("/login");
});

app.get("/login", (req, res) => res.render("login"));
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (!user) return res.send("Invalid username or password!");

  loggedInUser = user;
  res.redirect("/quiz");
});

app.get("/logout", (req, res) => {
  loggedInUser = null;
  res.redirect("/login");
});

// Quiz Routes
app.get("/quiz", isAuthenticated, async (req, res) => {
  const category = req.query.category || "html";
  const questions = await Question.find({ category });

  if (questions.length === 0)
    return res.send("No questions found for this category.");

  res.render("quiz", { questions, category });
});

app.post("/result", isAuthenticated, async (req, res) => {
  const { category } = req.body;
  const questions = await Question.find({ category });
  let score = 0;

  questions.forEach((q, index) => {
    if (req.body[`q${index}`] === q.answer.toString()) {
      score++;
    }
  });

  await User.findByIdAndUpdate(loggedInUser._id, {
    $push: { quizHistory: { category, score, total: questions.length } },
  });

  res.render("result", { score, total: questions.length });
});

// User Profile
app.get("/profile", isAuthenticated, async (req, res) => {
  const user = await User.findById(loggedInUser._id);
  res.render("profile", { user });
});

// Admin Routes
app.get("/admin/login", (req, res) => res.render("admin-login"));
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username, password });

  if (!admin) return res.send("Invalid Admin Credentials!");

  loggedInAdmin = admin;
  res.redirect("/admin/dashboard");
});

app.get("/admin/logout", (req, res) => {
  loggedInAdmin = null;
  res.redirect("/admin/login");
});

app.get("/admin/dashboard", isAdmin, async (req, res) => {
  const questions = await Question.find();
  const users = await User.find();
  res.render("admin-dashboard", { questions, users });
});

app.post("/admin/add-question", isAdmin, async (req, res) => {
  const { question, options, answer, category } = req.body;
  await Question.create({ question, options, answer, category });
  res.redirect("/admin/dashboard");
});

app.post("/admin/delete-question", async (req, res) => {
  const questionId = req.body.questionId;

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      console.log("❌ No question found with that ID.");
      return res.send("No question found with that ID.");
    }

    await Question.findByIdAndDelete(questionId);
    console.log(`✅ Question with ID ${questionId} deleted.`);
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error("❌ Error deleting question:", err);
    res.status(500).send("Error deleting question.");
  }
});


app.listen(port, () =>
  console.log(`🚀 Server running at http://localhost:${port}`)
);
