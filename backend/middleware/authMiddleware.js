const jwt = require('jsonwebtoken');
const Manager = require('../models/Manager');

// Middleware to protect routes by verifying JWT
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach it to the request object
      req.manager = await Manager.findById(decoded.id).select('-password');

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to authorize based on role
const isManager = (req, res, next) => {
  if (req.manager && req.manager.role === 'manager') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a manager' });
  }
};

module.exports = { protect, isManager };