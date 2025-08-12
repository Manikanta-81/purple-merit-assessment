const Manager = require("../models/Manager");
const jwt = require("jsonwebtoken");

// Utility function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const registerManager = async (req, res) => {
  const { username, password } = req.body;

  try {
    const managerExists = await Manager.findOne({ username });

    if (managerExists) {
      return res
        .status(400)
        .json({ message: "Manager with this username already exists" });
    }

    const manager = await Manager.create({
      username,
      password,
    });

    res.status(201).json({
      _id: manager._id,
      username: manager.username,
      token: generateToken(manager._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const loginManager = async (req, res) => {
  const { username, password } = req.body;

  try {
    const manager = await Manager.findOne({ username });

    // Check for manager and if password matches
    if (manager && (await manager.matchPassword(password))) {
      res.json({
        _id: manager._id,
        username: manager.username,
        token: generateToken(manager._id),
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { registerManager, loginManager };
