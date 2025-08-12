const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

// Routes for the collection endpoint: /api/orders
router.get("/", getAllOrders);
router.post("/", createOrder);

// Routes for a single document endpoint: /api/orders/:id
router.get("/:id", getOrderById);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;