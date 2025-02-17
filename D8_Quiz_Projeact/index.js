const express = require("express");
const mongoose = require("mongoose");
const { User, Question, Admin } = require("./models/questions");

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

  if (questions.length === 0) return res.send("No questions found.");

  res.render("quiz", { questions, category });
});

app.post("/result", isAuthenticated, async (req, res) => {
  const { category } = req.body;
  const questions = await Question.find({ category });

  console.log("🔹 Questions Retrieved:", questions);

  if (!questions || questions.length === 0) {
    console.error("❌ No questions found for category:", category);
    return res.send("No questions found.");
  }

  let score = 0;

  questions.forEach((q, index) => {
    const userAnswer = req.body[`q${index}`];

    console.log(`Q${index} - User: ${userAnswer}, Correct: ${q.answer}`);

    if (
      String(userAnswer).trim().toLowerCase() ===
      String(q.answer).trim().toLowerCase()
    ) {
      score++;
    }
  });

  console.log(`✅ Final Score: ${score} / ${questions.length}`);

  await User.findByIdAndUpdate(loggedInUser._id, {
    $push: { quizHistory: { category, score, total: questions.length } },
  });

  res.render("result", { score, total: questions.length });
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
    if (!question) return res.send("No question found.");

    await Question.findByIdAndDelete(questionId);
    res.redirect("/admin/dashboard");
  } catch (err) {
    res.status(500).send("Error deleting question.");
  }
});

// Add the route for updating questions
app.get("/admin/update-question", isAdmin, async (req, res) => {
  const questionId = req.query.questionId;
  const question = await Question.findById(questionId);

  if (!question) return res.send("Question not found.");

  res.render("update-question", { question });
});

app.post("/admin/update-question", isAdmin, async (req, res) => {
  const { questionId, question, options, answer, category } = req.body;
  try {
    await Question.findByIdAndUpdate(questionId, {
      question,
      options,
      answer,
      category,
    });
    res.redirect("/admin/dashboard");
  } catch (err) {
    res.status(500).send("Error updating question.");
  }
});

app.listen(port, () =>
  console.log(`🚀 Server running at http://localhost:${port}`)
);
