// src/components/DataCollector.js
import React, { useState, useEffect } from 'react';

function DataCollector() {
  const [vehicleData, setVehicleData] = useState({
    temperature: 0,
    enginePerformance: 0,
    brakeWear: 0,
  });

  // Simulate real-time updates every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicleData({
        temperature: Math.random() * 100,  // Simulating temperature
        enginePerformance: Math.random() * 100,  // Engine performance
        brakeWear: Math.random() * 100,  // Brake wear
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="data-collector">
      <h2>Real-Time Vehicle Data</h2>
      <p>Temperature: {vehicleData.temperature.toFixed(2)} °C</p>
      <p>Engine Performance: {vehicleData.enginePerformance.toFixed(2)}%</p>
      <p>Brake Wear: {vehicleData.brakeWear.toFixed(2)}%</p>
    </div>
  );
}

export default DataCollector;
