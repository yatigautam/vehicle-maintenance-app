import React, { useState, useEffect } from 'react';
import { createLSTMModel, forecastNextValues } from '../ForecastModel';
import VehicleStatus from './VehicleStatus';
import DataCollector from './DataCollector'; 
import MaintenanceSchedule from './MaintenanceSchedule';
import Analytics from './Analytics';
import AIPredictor from './AIPredictor';
import './Dashboard.css';

function Dashboard() {
  const [vehicleData, setVehicleData] = useState({
    temperature: 75,
    enginePerformance: 85,
    brakeWear: 40,
  });
  const [forecastData, setForecastData] = useState(null);

  useEffect(() => {
    async function setupModel() {
      const model = await createLSTMModel();
      const forecast = await forecastNextValues(model, [
        vehicleData.temperature,
        vehicleData.enginePerformance,
        vehicleData.brakeWear,
      ]);
      setForecastData({
        temperature: forecast[0].toFixed(2),
        enginePerformance: forecast[1].toFixed(2),
        brakeWear: forecast[2].toFixed(2),
      });
    }
    setupModel();
  }, [vehicleData]);

  const updateVehicleData = () => {
    setVehicleData({
      temperature: Math.random() * 100,
      enginePerformance: Math.random() * 100,
      brakeWear: Math.random() * 100,
    });
  };


  return (
    <div className="dashboard">
      <h1>Vehicle Maintenance Dashboard</h1>
      <button onClick={updateVehicleData}>Update Vehicle Data</button>
      <DataCollector />
      <MaintenanceSchedule vehicleData={vehicleData} />
      <AIPredictor vehicleData={vehicleData} />
      <Analytics />
      <VehicleStatus />

      <div className="forecast">
        <h2>Forecasted Vehicle Conditions</h2>
        {forecastData ? (
          <ul>
            <li>Temperature: {forecastData.temperature}°C</li>
            <li>Engine Performance: {forecastData.enginePerformance}%</li>
            <li>Brake Wear: {forecastData.brakeWear}%</li>
          </ul>
        ) : (
          <p>Loading forecast...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;