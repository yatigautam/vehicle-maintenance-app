import React from 'react';
import './VehicleStatus.css';

function VehicleStatus() {
  return (
    <div className="vehicle-status card">
      <h2>Real-Time Vehicle Status</h2>
      <p>Engine: Good</p>
      <p>Brake Wear: Moderate</p>
      <p>Tire Pressure: Normal</p>
    </div>
  );
}

export default VehicleStatus;