const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Driver name is required.'],
    trim: true,
  },
  currentShiftHours: {
    type: Number,
    required: true,
    default: 0,
  },
  past7DayWorkHours: {
    type: [Number],
    required: true,
    default: [],
  },
});

module.exports = mongoose.model('Driver', driverSchema);
