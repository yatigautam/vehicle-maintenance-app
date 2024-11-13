import React from 'react';

function MaintenanceSchedule({ vehicleData }) {
  const calculateNextServiceDate = () => {
    const { enginePerformance, brakeWear } = vehicleData;
    // Basic rules for setting a service date (placeholder for AI-based scheduling)
    if (enginePerformance < 60 || brakeWear > 70) {
      return "Schedule Service Soon";
    }
    return "Next Scheduled Service: In 3 Months";
  };

  return (
    <div className="maintenance-schedule">
      <h2>Customized Maintenance Plan</h2>
      <p>{calculateNextServiceDate()}</p>
    </div>
  );
}

export default MaintenanceSchedule;
