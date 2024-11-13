import React, { useState } from 'react';
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
    </div>
  );
}

export default Dashboard;