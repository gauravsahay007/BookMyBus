const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // For parsing JSON data

// Routes Import
const authRoutes = require("./routes/auth"); // Auth routes
const busRoutes = require("./routes/bus"); // Bus routes
const userRoutes = require("./routes/user"); // User routes
const bookingRoutes = require("./routes/booking"); // Booking routes

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes); 
 
// MongoDB Connection
mongoose.connect(process.env.DATABASE)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
 