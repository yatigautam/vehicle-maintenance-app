import React, { useState } from "react";
import axios from "axios";

const VehicleApp = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchData = async (endpoint) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/${endpoint}`);
            setData(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred');
          }
    };

    const predictiveAnalysis = async () => {
        try {
          const response = await axios.post('http://127.0.0.1:8000/predictive-analysis');
          setData(response.data);
          setError(null);
        } catch (err) {
          setError(err.response?.data?.detail || 'Error in predictive analysis');
        }
      };
      

    return (
        <div>
            <h1>Vehicle Maintenance App</h1>
            <button onClick={() => fetchData("fetch-current-data")}>Fetch Current Data</button>
            <button onClick={predictiveAnalysis}>Run Predictive Analysis</button>
            {data && (
        <div className="card">
          <h2>Prediction</h2>
          <p>Engine Condition: {data?.condition}</p>
          <p>Recommended Action: {data?.action}</p>
        </div>
      )}
            <button onClick={() => fetchData("time-series-forecasting")}>Time-Series Forecast</button>
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>

    );
};

export default VehicleApp;
