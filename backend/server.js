const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Middleware
app.use(cors()); // <-- make sure to call it as a function
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