const express = require("express");
const router = express.Router();

const {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
} = require("../controllers/routeController");

// Routes for the collection endpoint: /api/routes
router.get("/", getAllRoutes);
router.post("/", createRoute);

// Routes for a single document endpoint: /api/routes/:id
router.get("/:id", getRouteById);
router.put("/:id", updateRoute);
router.delete("/:id", deleteRoute);

module.exports = router;