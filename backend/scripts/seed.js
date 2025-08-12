const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const csv = require("csv-parser");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const Driver = require("../models/Driver");
const Route = require("../models/Route");
const Order = require("../models/Order");

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully.");

    console.log("Clearing existing data from collections...");
    await Promise.all([
      Driver.deleteMany({}),
      Route.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log(" Collections cleared.");

    console.log("Seeding Routes...");
    const routesData = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(__dirname, "../data", "routes.csv"))
        .pipe(csv())
        .on("data", (row) =>
          routesData.push({
            routeID: row.route_id,
            distanceInKm: parseFloat(row.distance_km),
            trafficLevel: row.traffic_level,
            baseTimeInMinutes: parseInt(row.base_time_min, 10),
          })
        )
        .on("end", resolve)
        .on("error", reject);
    });
    const insertedRoutes = await Route.insertMany(routesData);
    console.log(`${insertedRoutes.length} routes seeded.`);

    console.log("Seeding Drivers...");
    const driversData = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(__dirname, "../data", "drivers.csv"))
        .pipe(csv())
        .on("data", (row) =>
          driversData.push({
            name: row.name,
            currentShiftHours: parseInt(row.shift_hours, 10),
            past7DayWorkHours: row.past_week_hours.split("|").map(Number),
          })
        )
        .on("end", resolve)
        .on("error", reject);
    });
    await Driver.insertMany(driversData);
    console.log(`${driversData.length} drivers seeded.`);

    console.log("Seeding Orders and linking to Routes...");
    const routeMap = insertedRoutes.reduce((map, route) => {
      map[route.routeID] = route._id;
      return map;
    }, {});

    const ordersData = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(__dirname, "../data", "orders.csv"))
        .pipe(csv())
        .on("data", (row) => {
          const assignedRouteMongoId = routeMap[row.route_id];
          if (assignedRouteMongoId) {
            ordersData.push({
              orderID: row.order_id,
              valueInRs: parseFloat(row.value_rs),
              assignedRoute: assignedRouteMongoId,
            });
          } else {
            console.warn(
              `Warning: Route ID "${row.route_id}" for Order "${row.order_id}" not found. Skipping this order.`
            );
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });
    await Order.insertMany(ordersData);
    console.log(`${ordersData.length} orders seeded.`);

    console.log("\n Database seeding was successful!");
  } catch (error) {
    console.error("\n An error occurred during the seeding process:");
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log("\nMongoDB connection closed.");
  }
};

seedDatabase();
