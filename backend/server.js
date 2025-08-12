require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Simple test route
app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});