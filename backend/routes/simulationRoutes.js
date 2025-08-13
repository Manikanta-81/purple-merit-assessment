const express = require('express');
const router = express.Router();
const { runSimulation } = require('../controllers/simulationController');
const { protect, isManager } = require('../middleware/authMiddleware');

// @route   POST /api/simulation/run
// This route is protected and can only be accessed by a logged-in manager.
router.post('/run', protect, isManager, runSimulation);

module.exports = router;