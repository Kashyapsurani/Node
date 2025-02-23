require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Import the DB connection

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Import Routes
const movieRoutes = require("./routes/movieRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// ✅ Use Routes
app.use("/api/movies", movieRoutes);
app.use("/api/bookings", bookingRoutes);

// ✅ Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
