const express = require('express');
const router = express.Router();
const { registerManager, loginManager } = require('../controllers/authController');

// @route   POST /api/auth/register
router.post('/register', registerManager);

// @route   POST /api/auth/login
router.post('/login', loginManager);

module.exports = router;