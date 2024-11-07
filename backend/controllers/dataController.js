const VehicleData = require('../models/VehicleData');

// Fetch vehicle data
exports.getData = async (req, res) => {
    const data = await VehicleData.find();
    res.json(data);
};

// Add vehicle data
exports.addData = async (req, res) => {
    const newData = new VehicleData(req.body);
    await newData.save();
    res.json(newData);
};

// Check maintenance risk based on thresholds
exports.checkRisk = async (req, res) => {
    const data = req.body;
    const risk = {
        overheatRisk: data.engineTemp > 100,
        brakeWearRisk: data.brakeWear > 80,
        batteryRisk: data.batteryHealth < 60
    };
    res.json(risk);
};
