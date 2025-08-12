const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderID: {
    type: String,
    required: [true, 'Order ID is required.'],
    unique: true,
    trim: true,
  },
  valueInRs: {
    type: Number,
    required: [true, 'Order value is required.'],
  },
  assignedRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  deliveryTimestamp: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('Order', orderSchema);