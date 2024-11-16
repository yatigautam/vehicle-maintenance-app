import * as tf from '@tensorflow/tfjs';
import { loadAndPreprocessData } from './dataUtils';

export async function trainModel(datasetPath) {
  const { features, labels } = await loadAndPreprocessData(datasetPath);

  const model = createLSTMModel(features.shape[1]);

  model.compile({
    optimizer: 'adam',
    loss: 'meanSquaredError',
    metrics: ['mse'],
  });

  console.log('Starting training...');
  await model.fit(features, labels, {
    epochs: 50,
    batchSize: 16,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch}: Loss = ${logs.loss}`);
      },
    },
  });

  console.log('Model trained successfully!');
  return model;
}

function createLSTMModel(inputShape) {
  const model = tf.sequential();
  model.add(tf.layers.lstm({ units: 50, returnSequences: false, inputShape: [inputShape, 1] }));
  model.add(tf.layers.dense({ units: 1, activation: 'linear' }));
  return model;
}
