const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeID: {
    type: String,
    required: [true, 'Route ID is required.'],
    unique: true,
    trim: true,
  },
  distanceInKm: {
    type: Number,
    required: [true, 'Route distance is required.'],
  },
  trafficLevel: {
    type: String,
    required: [true, 'Traffic level is required.'],
    enum: ['Low', 'Medium', 'High'],
  },
  baseTimeInMinutes: {
    type: Number,
    required: [true, 'Base time for the route is required.'],
  },
});

module.exports = mongoose.model('Route', routeSchema);
    