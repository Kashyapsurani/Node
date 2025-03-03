const express = require("express");
const cors = require("cors");
const transactionRoutes = require("./routes/transactionRoutes");
const connectDB = require("./config/db"); // Import the database connection

// Initialize Express App
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB(); // Call the function to connect to MongoDB

// Routes
app.use("/transactions", transactionRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
