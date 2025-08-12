const Driver = require('../models/Driver');
const mongoose = require('mongoose');

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Public
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({});
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single driver by ID
// @route   GET /api/drivers/:id
// @access  Public
const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new driver
// @route   POST /api/drivers
// @access  Public
const createDriver = async (req, res) => {
  try {
    const { name, currentShiftHours, past7DayWorkHours } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Please provide a name for the driver.' });
    }

    const newDriver = new Driver({
      name,
      currentShiftHours,
      past7DayWorkHours,
    });

    const savedDriver = await newDriver.save();
    res.status(201).json(savedDriver);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update an existing driver
// @route   PUT /api/drivers/:id
// @access  Public
const updateDriver = async (req, res) => {
    
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Step 2: Update the driver's properties with data from the request body.
    // If a field is not provided in the body, it keeps its old value.
    driver.name = req.body.name || driver.name;
    driver.currentShiftHours = req.body.currentShiftHours ?? driver.currentShiftHours;
    driver.past7DayWorkHours = req.body.past7DayWorkHours || driver.past7DayWorkHours;

    // Step 3: Save the updated driver back to the database
    const updatedDriver = await driver.save();

    res.status(200).json(updatedDriver);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a driver
// @route   DELETE /api/drivers/:id
// @access  Public
const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json({ message: 'Driver removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};