from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.preprocessing.sequence import TimeseriesGenerator
from flask_cors import CORS  # For enabling cross-origin requests
import logging

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Load dataset
DATASET_PATH = "../frontend/src/data/vehicle_data.csv"

@app.route('/')
def home():
    """Health check endpoint."""
    return "Server is running!"

@app.route('/vehicle-data', methods=['GET'])
def get_vehicle_data():
    """
    Fetches vehicle data from the CSV file.
    """
    try:
        data = pd.read_csv(DATASET_PATH)
        return data.to_json(orient='records')
    except Exception as e:
        return jsonify({'error': f"Error reading dataset: {str(e)}"}), 500

@app.route('/predictive-analysis', methods=['POST'])
def predictive_analysis():
    """
    Performs predictive analysis on vehicle data.
    """
    try:
        # Load and preprocess data
        data = pd.read_csv(DATASET_PATH)
        features = ['Lub oil pressure', 'Coolant pressure', 'Engine rpm']
        target = 'Engine Condition'
        
        # Add dummy target column if not present
        if target not in data.columns:
            data[target] = np.random.uniform(0, 1, len(data))  # Dummy target for testing

        X = data[features]
        y = data[target]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train a simple regression model
        model = LinearRegression()
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)
        
        return jsonify({'predictions': predictions.tolist()})
    except KeyError as e:
        return jsonify({'error': f"Missing columns in dataset: {str(e)}"}), 400
    except Exception as e:
        return jsonify({'error': f"Error during predictive analysis: {str(e)}"}), 500

@app.route('/time-series-forecast', methods=['POST'])
def time_series_forecast():
    """
    Performs time-series forecasting using an LSTM model.
    """
    try:
        # Load and preprocess data
        data = pd.read_csv(DATASET_PATH)
        target = 'Lub oil pressure'
        if target not in data.columns:
            return jsonify({'error': f'Column "{target}" not found in dataset'}), 400

        # Prepare data for LSTM
        sequence_data = data[target].values.reshape(-1, 1)
        generator = TimeseriesGenerator(sequence_data, sequence_data, length=10, batch_size=1)

        # Define LSTM model
        model = Sequential([
            LSTM(50, activation='relu', input_shape=(10, 1)),
            Dense(1)
        ])
        model.compile(optimizer='adam', loss='mse')
        model.fit(generator, epochs=5, verbose=1)

        # Forecast next 10 values
        forecast = model.predict(sequence_data[-10:].reshape(1, 10, 1))
        return jsonify({'forecast': forecast.flatten().tolist()})
    except KeyError as e:
        return jsonify({'error': f"Missing columns in dataset: {str(e)}"}), 400
    except Exception as e:
        return jsonify({'error': f"Error during time-series forecasting: {str(e)}"}), 500

@app.errorhandler(404)
def route_not_found(error):
    """
    Handles 404 errors for undefined routes.
    """
    return jsonify({'error': 'Route not found. Check the endpoint URL and method.'}), 404

if __name__ == '__main__':
    app.run(debug=True)
