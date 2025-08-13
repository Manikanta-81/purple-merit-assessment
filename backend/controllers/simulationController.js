const Driver = require('../models/Driver');
const Order = require('../models/Order');
const SimulationResult = require('../models/SimulationResult');

const runSimulation = async (req, res) => {
  try {
    const { numberOfDrivers, routeStartTime, maxHoursPerDriver } = req.body;

    // --- 1. INPUT VALIDATION ---
    if (!numberOfDrivers || !routeStartTime || !maxHoursPerDriver) {
      return res.status(400).json({ message: 'Please provide all simulation inputs: numberOfDrivers, routeStartTime, and maxHoursPerDriver.' });
    }
    if (numberOfDrivers <= 0 || maxHoursPerDriver <= 0) {
        return res.status(400).json({ message: 'Number of drivers and max hours must be positive values.' });
    }

    const allDrivers = await Driver.find({});
    const allOrders = await Order.find({}).populate('assignedRoute');

    if (numberOfDrivers > allDrivers.length) {
        return res.status(400).json({ message: `Input drivers (${numberOfDrivers}) exceeds available drivers (${allDrivers.length}).` });
    }

    // --- 2. INITIALIZE SIMULATION VARIABLES ---
    let totalProfit = 0;
    let totalFuelCost = 0;
    let onTimeDeliveries = 0;
    let lateDeliveries = 0;
    
    const selectedDrivers = allDrivers.slice(0, numberOfDrivers);
    let unassignedOrders = [...allOrders];
    
    // --- 3. PROCESS DELIVERIES ---
    for (const driver of selectedDrivers) {
        let driverCurrentHours = 0;

        while (driverCurrentHours < maxHoursPerDriver && unassignedOrders.length > 0) {
            const order = unassignedOrders.shift();
            const route = order.assignedRoute;

            if (!route) continue;

            // --- APPLY COMPANY RULES ---

            // Rule 2: Driver Fatigue Rule
            const isFatigued = driver.past7DayWorkHours.some(hours => hours > 8);
            let actualDeliveryTimeMinutes = route.baseTimeInMinutes;
            if (isFatigued) {
                actualDeliveryTimeMinutes *= 1.30;
            }

            const deliveryTimeHours = actualDeliveryTimeMinutes / 60;
            if (driverCurrentHours + deliveryTimeHours > maxHoursPerDriver) {
                unassignedOrders.unshift(order);
                break; 
            }
            driverCurrentHours += deliveryTimeHours;

            // Rule 1: Late Delivery Penalty
            const lateThresholdMinutes = route.baseTimeInMinutes + 10;
            const isLate = actualDeliveryTimeMinutes > lateThresholdMinutes;

            let orderBonus = 0;
            let orderPenalty = 0;

            if (isLate) {
                orderPenalty = 50;
                lateDeliveries++;
            } else {
                onTimeDeliveries++;
                // Rule 3: High-Value Bonus
                if (order.valueInRs > 1000) {
                    orderBonus = order.valueInRs * 0.10;
                }
            }

            // Rule 4: Fuel Cost Calculation
            let fuelCost = route.distanceInKm * 5;
            if (route.trafficLevel === 'High') {
                fuelCost += route.distanceInKm * 2;
            }
            
            // Rule 5: Calculate Overall Profit for this order
            totalProfit += (order.valueInRs + orderBonus - orderPenalty - fuelCost);
            totalFuelCost += fuelCost;
        }
    }

    // --- 4. CALCULATE FINAL KPIs ---
    const totalDeliveries = onTimeDeliveries + lateDeliveries;
    const efficiencyScore = totalDeliveries > 0 ? (onTimeDeliveries / totalDeliveries) * 100 : 0;

    // --- 5. SAVE & RESPOND ---
    const result = new SimulationResult({
        totalProfit,
        efficiencyScore,
        onTimeDeliveries,
        lateDeliveries,
        totalFuelCost,
        simulationInputs: {
            numberOfDrivers,
            routeStartTime, // Now correctly included
            maxHoursPerDriver,
        },
    });

    await result.save();

    res.status(200).json({
        message: 'Simulation completed successfully.',
        results: {
            totalProfit: parseFloat(totalProfit.toFixed(2)),
            efficiencyScore: parseFloat(efficiencyScore.toFixed(2)),
            onTimeDeliveries,
            lateDeliveries,
            totalDeliveries,
            totalFuelCost: parseFloat(totalFuelCost.toFixed(2)),
            unassignedOrders: unassignedOrders.length,
        },
        simulationId: result._id
    });

  } catch (error) {
    console.error('Simulation Error:', error);
    res.status(500).json({ message: 'Server Error during simulation', error: error.message });
  }
};

module.exports = {
  runSimulation,
};