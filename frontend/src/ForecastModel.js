// src/ForecastModel.js
import * as tf from '@tensorflow/tfjs';

// Sample historical data for vehicle temperature, engine performance, brake wear, etc.
const sampleData = [
  { temperature: 70, enginePerformance: 90, brakeWear: 35 },
  { temperature: 72, enginePerformance: 88, brakeWear: 34 },
  { temperature: 71, enginePerformance: 87, brakeWear: 33 },
  // Add more historical data points here
];

// Prepare the data for training// src/ForecastModel.js
const prepareData = (data) => {
    const values = data.map(d => [d.temperature, d.enginePerformance, d.brakeWear]);
    const input = values.slice(0, values.length - 1).map(val => [val]); // 3D array
    const output = values.slice(1).map(val => [val]); // 3D array
    return { input, output };
  };

// Build and train the LSTM model
export async function createLSTMModel() {
  const model = tf.sequential();
  model.add(tf.layers.lstm({ units: 50, inputShape: [1, 3], returnSequences: true }));
  model.add(tf.layers.dense({ units: 3 })); // Predicts temperature, performance, and brake wear

  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

  const { input, output } = prepareData(sampleData);
  const xs = tf.tensor3d(input, [input.length, 1, 3]);
  const ys = tf.tensor3d(output, [output.length, 1, 3]);

  await model.fit(xs, ys, { epochs: 100 });

  return model;
}

// Function to forecast future values based on recent data
export async function forecastNextValues(model, recentData) {
  const input = tf.tensor3d([recentData], [1, 1, 3]);
  const prediction = model.predict(input);
  return prediction.arraySync()[0][0]; // Returns forecasted values
}
