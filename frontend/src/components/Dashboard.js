import React, { useState } from "react";
import axios from "axios";

const VehicleApp = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchData = async (endpoint) => {
        try {
            const response = await axios.get(`https://vehicle-maintenance-app.onrender.com/fetch_current_data`);
            setData(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred');
          }
    };

    const predictiveAnalysis = async () => {
        try {
          const response = await axios.post('https://vehicle-maintenance-app.onrender.com/predictive-analysis');
          setData(response.data);
          setError(null);
        } catch (err) {
          setError(err.response?.data?.detail || 'Error in predictive analysis');
        }
      };

      const timeSeriesForecasting = async () => {
        try {
          const response = await axios.post('https://vehicle-maintenance-app.onrender.com/time-series-forecasting/');
          setData(response.data);
          setError(null);
        } catch (err) {
          setError(err.response?.data?.detail || 'Error in time-series forecasting');
        }
      };
      
      const componentAnalysis = async () => {
        try {
            const response = await axios.post('https://vehicle-maintenance-app.onrender.com/component-fixation/');
            setData(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error in component analysis');
        }
    };

    return (
        <div>
            <h1>Vehicle Maintenance App</h1>
            <button onClick={() => fetchData("fetch_current_data")}>Fetch Current Data</button>
            <button onClick={predictiveAnalysis}>Run Predictive Analysis</button>
            <button onClick={timeSeriesForecasting}>Time-Series Forecast</button>
            <button onClick={componentAnalysis}>Run Component Analysis</button>
            
            {data && data?.component_analysis && (
                <div className="card">
                    <h2>Component Analysis</h2>
                    <ul>
                        {data.component_analysis.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                )}
                
            {data && (
        <div className="card">
          <h2>Prediction</h2>
          <p>Engine Condition: {data?.condition}</p>
          <p>Recommended Action: {data?.action}</p>
        </div>
      )}
            
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>

    );
};

export default VehicleApp;
