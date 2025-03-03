const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize Express App
const app = express();
app.use(express.json()); // For parsing JSON data
app.use(cors()); // Enable CORS to allow cross-origin requests

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/ie", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Mongoose Schema & Model
const transactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  date: { type: Date, default: Date.now }, // Adds the date the transaction was created
});

const Transaction = mongoose.model("Transaction", transactionSchema);

// Routes

// Get all transactions
app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
});

// Add a new transaction
app.post("/transactions", async (req, res) => {
  try {
    const { title, amount, type, date } = req.body;

    // Validate request
    if (!title || !amount || !type) {
      return res
        .status(400)
        .json({ message: "Title, Amount, and Type are required" });
    }

    // Create a new transaction
    const newTransaction = new Transaction({ title, amount, type, date });

    // Save the transaction to the database
    await newTransaction.save();

    // Respond with the saved transaction
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: "Error adding transaction", error });
  }
});

// Update a transaction (if needed)
app.put("/transactions/:id", async (req, res) => {
  try {
    const { title, amount, type, date } = req.body;
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { title, amount, type, date },
      { new: true }
    );
    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: "Error updating transaction", error });
  }
});

// Delete a transaction
app.delete("/transactions/:id", async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(
      req.params.id
    );
    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction", error });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
