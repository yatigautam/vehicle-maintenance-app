import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import Papa from 'papaparse';

// Function to load and preprocess the Kaggle dataset
export const loadDataset = async (csvPath) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvPath, {
      download: true,
      header: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (err) => {
        reject(err);
      },
    });
  });
};

// Function to preprocess data for ML model
export const preprocessData = (data) => {
  const inputs = data.map((row) => [
    parseFloat(row['engine_rpm']),
    parseFloat(row['temperature']),
    parseFloat(row['pressure']),
  ]);
  const labels = data.map((row) => parseFloat(row['requires_maintenance']));
  return { inputs, labels };
};

// Function to create and train the model
export const trainModel = async (inputs, labels) => {
  const inputTensor = tf.tensor2d(inputs);
  const labelTensor = tf.tensor1d(labels);

  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [inputs[0].length], units: 10, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

  await model.fit(inputTensor, labelTensor, {
    epochs: 20,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks(
      { name: 'Training Performance' },
      ['loss', 'acc'],
      { height: 200, callbacks: ['onEpochEnd'] }
    ),
  });

  return model;
};

// Function to save the trained model for use in Dashboard.js
export const saveModel = async (model) => {
  await model.save('localstorage://vehicle-maintenance-model');
};
