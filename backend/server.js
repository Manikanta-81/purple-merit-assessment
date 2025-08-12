require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

app.use(cors());
// app.use(bodyParser.json());
app.use(express.json());


//Import Route file
const driverRoutes= require("./routes/driverRoutes");


//Routes
app.use('/api/drivers', driverRoutes);
  
// Simple test route
app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});