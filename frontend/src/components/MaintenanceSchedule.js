import React from 'react';
import './MaintenanceSchedule.css';

function MaintenanceSchedule() {
  return (
    <div className="maintenance-schedule card">
      <h2>Maintenance Schedule</h2>
      <ul>
        <li>Next Service: 2024-12-01</li>
        <li>Last Service: 2024-10-15</li>
      </ul>
    </div>
  );
}

export default MaintenanceSchedule;
