import React, { useState, useEffect } from "react";
import "./Dashboard.css";

// Importing additional components
import DataCollector from "./DataCollector";
import MaintenanceSchedule from "./MaintenanceSchedule";
import AIPredictor from "./AIPredictor";
import Analytics from "./Analytics";
import VehicleStatus from "./VehicleStatus";

function Dashboard() {
  // State for CSV data
  const [csvData, setCsvData] = useState(null);

  // State for predictions (from predictive analysis)
  const [predictions, setPredictions] = useState([]);

  // State for forecasts (time series analysis)
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    // Fetch the dataset on component mount
    async function fetchDataset() {
      try {
        const response = await fetch("/api/vehicle-data");
        const data = await response.json();
        setCsvData(data); // Set CSV data to state
        console.log("Fetched CSV Data:", data); // Debugging log
      } catch (error) {
        console.error("Error fetching dataset:", error);
      }
    }

    fetchDataset();
  }, []); // Empty dependency array ensures this runs once

  // Function to handle predictive analysis
  const handlePredictiveAnalysis = async () => {
    try {
      const response = await fetch(
        "/api/vehicle-data",
        {
          method: "POST",
        }
      );
      const data = await response.json();
      setPredictions(data.predictions || []); // Ensure fallback to empty array
    } catch (error) {
      console.error("Error performing predictive analysis:", error);
    }
  };

  // Function to handle time series forecasting
  const handleForecast = async () => {
    try {
      const response = await fetch(
        "/api/vehicle-data",
        {
          method: "POST",
        }
      );
      const data = await response.json();
      setForecast(data.forecast || []); // Ensure fallback to empty array
    } catch (error) {
      console.error("Error performing forecast:", error);
    }
  };

  return (
    <div className="dashboard">
      <h1>Vehicle Maintenance Dashboard</h1>

      {/* Predictive Analysis Button */}
      <button onClick={handlePredictiveAnalysis}>
        Run Predictive Analysis
      </button>
      <ul>
        {predictions.map((prediction, index) => (
          <li key={index}>
            Prediction {index + 1}: {prediction}
          </li>
        ))}
      </ul>

      {/* Time Series Forecast Button */}
      <button onClick={handleForecast}>Run Time Series Forecast</button>
      <ul>
        {forecast.map((value, index) => (
          <li key={index}>
            Forecast {index + 1}: {value}
          </li>
        ))}
      </ul>

      {/* Display CSV Data */}
      <h2>CSV Data:</h2>
      <pre>{JSON.stringify(csvData, null, 2)}</pre>

      {/* Custom Components */}
      <DataCollector />
      <MaintenanceSchedule vehicleData={csvData} />
      <AIPredictor vehicleData={csvData} />
      <Analytics />
      <VehicleStatus />

      {/* CSV Data Preview Section */}
      <div className="csv-data">
        <h3>CSV Data Preview</h3>
        <pre>{csvData ? JSON.stringify(csvData, null, 2) : "No data available"}</pre>
      </div>
    </div>
  );
}

export default Dashboard;
