import React from 'react';
import VehicleStatus from './VehicleStatus';
import MaintenanceSchedule from './MaintenanceSchedule';
import Analytics from './Analytics';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard container">
      <VehicleStatus />
      <MaintenanceSchedule />
      <Analytics />
    </div>
  );
}

export default Dashboard;
