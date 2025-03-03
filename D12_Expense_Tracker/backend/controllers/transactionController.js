const Transaction = require("../models/Transaction");

// Get all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};

// Add a new transaction
exports.addTransaction = async (req, res) => {
  try {
    const { title, amount, type, date } = req.body;

    if (!title || !amount || !type) {
      return res
        .status(400)
        .json({ message: "Title, Amount, and Type are required" });
    }

    const newTransaction = new Transaction({ title, amount, type, date });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: "Error adding transaction", error });
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
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
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
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
};
