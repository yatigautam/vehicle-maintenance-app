const mongoose = require('mongoose');

const VehicleDataSchema = new mongoose.Schema({
    vehicleId: String,
    engineTemp: Number,
    brakeWear: Number,
    batteryHealth: Number,
    lastMaintenance: Date,
});

module.exports = mongoose.model('VehicleData', VehicleDataSchema);
