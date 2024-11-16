import * as tf from '@tensorflow/tfjs';
import Papa from 'papaparse';

// Load and preprocess data
export async function loadAndPreprocessData(filePath) {
  const csvData = await fetch(filePath).then((response) => response.text());
  const parsedData = Papa.parse(csvData, { header: true, dynamicTyping: true });

  // Extract features (inputs) and labels (outputs)
  const features = [];
  const labels = [];
  parsedData.data.forEach((row) => {
    if (row.timestamp && row.temperature && row.brakeWear) {
      features.push([row.temperature, row.brakeWear]);
      labels.push(row.enginePerformance);
    }
  });

  // Normalize data
  const featureTensor = tf.tensor2d(features);
  const labelTensor = tf.tensor1d(labels);
  const normalizedFeatures = normalize(featureTensor);
  const normalizedLabels = labelTensor.div(tf.scalar(100)); // Scale labels

  return { features: normalizedFeatures, labels: normalizedLabels };
}

// Normalize function
function normalize(tensor) {
  const min = tensor.min(0);
  const max = tensor.max(0);
  return tensor.sub(min).div(max.sub(min));
}
