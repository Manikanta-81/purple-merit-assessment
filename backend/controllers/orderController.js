const Order = require("../models/Order");
const mongoose = require("mongoose");

const getAllOrders = async (req, res) => {
  try {
    // .populate() will replace the assignedRoute ObjectId with the full route document
    const orders = await Order.find({}).populate("assignedRoute");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("assignedRoute");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { orderID, valueInRs, assignedRoute } = req.body;

    if (!orderID || !valueInRs || !assignedRoute) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields for the order." });
    }

    const newOrder = new Order({
      orderID,
      valueInRs,
      assignedRoute, // This should be the ObjectId of an existing route
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "An order with this orderID already exists." });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
