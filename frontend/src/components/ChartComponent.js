import React from 'react';
import { Line } from 'react-chartjs-2'; // Assuming you're using Chart.js

function ChartComponent({ data }) {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Vehicle Maintenance Data',
        data: data.values,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="chart-container">
      <h3>Vehicle Maintenance Data Chart</h3>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

export default ChartComponent;
