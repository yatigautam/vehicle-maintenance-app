from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
from keras.models import Sequential
from keras.layers import LSTM, Dense
import os

# Initialize the FastAPI app
app = FastAPI()
@app.get("/")
def read_root():
    return {"message": "Welcome to the Vehicle Maintenance API!"}

@app.get("/status")
def get_status():
    return {"status": "running"}

# File paths
DATASET_PATH = "frontend/src/data/vehicle_data.csv"  # Ensure this file exists at the specified path

@app.get("/test-dataset")
def test_dataset():
    try:
        with open(DATASET_PATH, 'r') as f:
            return {"message": "Dataset loaded successfully."}
    except FileNotFoundError:
        return {"message": "Dataset not found."}

# Load the dataset
def load_data():
    try:
        data = pd.read_csv(DATASET_PATH)
        return data
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Dataset not found. Check the file path.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading data: {str(e)}")


@app.get("/fetch-current-data")
def fetch_current_data():
    """
    Fetch the latest data from the dataset.
    """
    data = load_data()
    latest_data = data.iloc[-1]  # Get the most recent row
    current_data = {
        "Temperature": latest_data["Temperature"],
        "Engine RPM": latest_data["Engine rpm"],
        "Lub Oil Pressure": latest_data["Lub oil pressure"],
        "Coolant Pressure": latest_data["Coolant pressure"],
    }
    return JSONResponse(content=current_data)


@app.post("/predictive-analysis")
def predictive_analysis():
    """
    Predict the engine condition based on the dataset.
    """
    try:
        data = load_data()
        features = ['Lub oil pressure', 'Coolant pressure', 'Engine rpm']
        target = 'Engine Condition'
        
        # Encode target variable if categorical
        label_encoder = LabelEncoder()
        if data[target].dtype == 'object':
            data[target] = label_encoder.fit_transform(data[target])
        
        X = data[features]
        y = data[target]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        model = LinearRegression()
        model.fit(X_train, y_train)
        predictions = model.predict([X.iloc[-1].values])  # Predict using the latest data

        # Decode the condition label if encoded
        predicted_condition = label_encoder.inverse_transform([int(round(predictions[0]))])[0]
        return {"Predicted Engine Condition": predicted_condition}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in predictive analysis: {str(e)}")


@app.post("/time-series-forecasting")
def time_series_forecasting():
    """
    Predict the next maintenance schedule using time series forecasting.
    """
    try:
        data = load_data()
        temperatures = data['Temperature'].values.reshape(-1, 1)

        # Define the LSTM model
        model = Sequential([
            LSTM(50, return_sequences=False, input_shape=(1, 1)),
            Dense(1)
        ])
        model.compile(optimizer='adam', loss='mse')

        # Prepare the data
        temperatures_normalized = temperatures / np.max(temperatures)  # Normalize data
        X = temperatures_normalized[:-1]
        y = temperatures_normalized[1:]
        X = np.expand_dims(X, axis=1)  # Reshape for LSTM

        model.fit(X, y, epochs=10, batch_size=1, verbose=0)  # Train the model

        # Predict the next value
        last_temp = temperatures_normalized[-1].reshape(1, 1, 1)
        next_temp = model.predict(last_temp).flatten()[0]
        next_temp_denormalized = next_temp * np.max(temperatures)

        # Schedule maintenance based on predicted temperature
        alert = None
        if next_temp_denormalized > 100:  # Critical threshold
            alert = "Alert: High temperature detected! Immediate maintenance required."

        return {
            "Next Predicted Temperature": next_temp_denormalized,
            "Scheduled Maintenance": (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'),
            "Alert": alert
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in time-series forecasting: {str(e)}")
