// src/components/AIPredictor.js
import React, { useEffect, useState } from 'react';

function AIPredictor({ vehicleData }) {
  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    const { temperature, enginePerformance, brakeWear } = vehicleData;
    if (temperature > 90 || brakeWear > 80) {
      setPrediction("Potential Component Failure Predicted");
    } else if (enginePerformance < 50) {
      setPrediction("Engine Performance Issue Detected");
    } else {
      setPrediction("All Systems Normal");
    }
  }, [vehicleData]);

  return (
    <div className="ai-predictor">
      <h2>AI-Driven Insights</h2>
      <p>{prediction}</p>
    </div>
  );
}

export default AIPredictor;
