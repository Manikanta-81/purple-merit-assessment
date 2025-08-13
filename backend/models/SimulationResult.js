const mongoose = require('mongoose');

const simulationResultSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  totalProfit: {
    type: Number,
    required: true,
  },
  efficiencyScore: {
    type: Number,
    required: true,
  },
  onTimeDeliveries: {
    type: Number,
    required: true,
  },
  lateDeliveries: {
    type: Number,
    required: true,
  },
  totalFuelCost: {
    type: Number,
    required: true,
  },
  simulationInputs: {
    numberOfDrivers: Number,
    routeStartTime: String,
    maxHoursPerDriver: Number,
  },
});

module.exports = mongoose.model('SimulationResult', simulationResultSchema);