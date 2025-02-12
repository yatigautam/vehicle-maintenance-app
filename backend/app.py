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
from fastapi.middleware.cors import CORSMiddleware
import logging

logging.basicConfig(level=logging.DEBUG)

# Initialize your FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify domains instead of "*" for security
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Vehicle Maintenance API!"}

@app.get("/status")
def get_status():
    return {"status": "running"}

# File paths
DATASET_PATH = 'datasets/vehicle_data.csv'

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
    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=500, detail="Dataset is empty.")
    except pd.errors.ParserError as e:
        raise HTTPException(status_code=500, detail=f"Error parsing dataset: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error loading data: {str(e)}")

@app.get("/fetch_current_data")
def fetch_current_data():
    """
    Fetch the latest data from the dataset.
    """
    data = load_data()
    if data.empty:
        raise HTTPException(status_code=500, detail="Dataset is empty. Cannot fetch current data.")
    try:
        latest_data = data.iloc[-1]  # Get the most recent row
        current_data = {
            "Engine rpm": latest_data["Engine rpm"],
            "Lub oil pressure": latest_data["Lub oil pressure"],
            "Fuel pressure": latest_data["Fuel pressure"],
            "Coolant pressure": latest_data["Coolant pressure"],
            "Lub oil temp": latest_data["lub oil temp"],
            "Coolant temp": latest_data["Coolant temp"],
            "Engine Condition": latest_data["Engine Condition"],
        }
        return JSONResponse(content=current_data)
    except KeyError as e:
        raise HTTPException(status_code=500, detail=f"Missing column in dataset: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {str(e)}")

@app.post("/predictive-analysis/")
def predictive_analysis():
    """
    Predict the engine condition based on the dataset.
    """
    try:
        # Load data
        data = load_data()

        # Define features and target
        features = ['Engine rpm', 'Lub oil pressure', 'Fuel pressure', 'Coolant pressure', 'lub oil temp', 'Coolant temp']
        target = 'Engine Condition'
        
        # Check for missing columns
        missing_columns = [col for col in features + [target] if col not in data.columns]
        if missing_columns:
            raise HTTPException(status_code=500, detail=f"Missing columns: {', '.join(missing_columns)}")

        # Extract features and target
        X = data[features]
        y = data[target]

        # Split the data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train the model
        model = LinearRegression()
        model.fit(X_train, y_train)

        # Prepare the latest feature values for prediction
        latest_features = X.iloc[-1].values.reshape(1, -1)

        # Predict the engine condition
        prediction = model.predict(latest_features)[0]

        # Round the prediction to the nearest integer (since target is 0 or 1)
        predicted_condition = round(prediction)

        return {"Predicted Engine Condition": int(predicted_condition)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in predictive analysis: {str(e)}")


@app.post("/time-series-forecasting/")
def time_series_forecasting():
    """
    Predict the next maintenance schedule using time series forecasting.
    """
    try:
        data = load_data()
        if 'Engine rpm' not in data.columns:
            raise HTTPException(status_code=500, detail="Engine rpm column is missing in the dataset.")
        
        engine_rpm = data['Engine rpm'].values.reshape(-1, 1)
        logging.debug(f"Engine RPM values: {engine_rpm}")

        if len(engine_rpm) < 2:
            raise HTTPException(status_code=500, detail="Insufficient data for forecasting.")

        # Normalize data
        max_rpm = np.max(engine_rpm)
        logging.debug(f"Max RPM value: {max_rpm}")

        if max_rpm == 0:
            raise HTTPException(status_code=500, detail="Max RPM is zero, cannot normalize.")
        
        normalized_rpm = engine_rpm / max_rpm
        X = normalized_rpm[:-1]
        y = normalized_rpm[1:]
        X = np.expand_dims(X, axis=1)  # Reshape for LSTM
        logging.debug(f"Normalized RPM: {normalized_rpm}")

        # Define and train the LSTM model
        model = Sequential([
            LSTM(50, return_sequences=False, input_shape=(1, 1)),
            Dense(1)
        ])
        model.compile(optimizer='adam', loss='mse')
        model.fit(X, y, epochs=10, batch_size=1, verbose=0)

        # Predict the next value
        last_rpm = normalized_rpm[-1].reshape(1, 1, 1)
        next_rpm = model.predict(last_rpm).flatten()[0]
        logging.debug(f"Predicted next RPM (normalized): {next_rpm}")

        next_rpm_denormalized = next_rpm * max_rpm
        logging.debug(f"Predicted next RPM (denormalized): {next_rpm_denormalized}")

        alert = "Alert: High RPM detected! Immediate maintenance required." if next_rpm_denormalized > 1200 else None

        return {
            "Next Predicted Engine RPM": next_rpm_denormalized,
            "Scheduled Maintenance": (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'),
            "Alert": alert
        }
    except Exception as e:
        logging.error(f"Error in time-series forecasting: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error in time-series forecasting: {str(e)}")

@app.post("/component-fixation/")
def component_fixation():
    """
    Predict which component needs fixation based on the dataset.
    """
    try:
        # Load data
        data = load_data()

        # Define features and corresponding components
        features = ['Engine rpm', 'Lub oil pressure', 'Fuel pressure', 'Coolant pressure', 'lub oil temp', 'Coolant temp']
        components = ['Engine', 'Lubrication System', 'Fuel System', 'Cooling System', 'Lubrication System', 'Cooling System']

        # Check for missing columns
        missing_columns = [col for col in features if col not in data.columns]
        if missing_columns:
            raise HTTPException(status_code=500, detail=f"Missing columns in dataset: {', '.join(missing_columns)}")

        # Get the latest data for prediction
        latest_data = data.iloc[-1][features]

        # Define thresholds for components
        thresholds = {
            'Engine rpm': 1200,
            'Lub oil pressure': 20,
            'Fuel pressure': 30,
            'Coolant pressure': 15,
            'lub oil temp': 80,
            'Coolant temp': 90
        }

        # Analyze the latest data and determine components needing fixation
        fixations = []
        for feature, component in zip(features, components):
            if feature in thresholds and latest_data[feature] > thresholds[feature]:
                fixations.append({
                    "Component": component,
                    "Issue": f"{feature} exceeds threshold",
                    "Suggested Fix": f"Inspect and repair {component.lower()}"
                })

        if not fixations:
            return {"message": "No immediate fixations required. All components are within acceptable ranges."}

        # Prepare response for user and service center
        response = {
            "User Output": f"{len(fixations)} components require attention.",
            "Fixation Details": fixations,
            "Service Center Output": {
                "Components": [f["Component"] for f in fixations],
                "Issues": [f["Issue"] for f in fixations],
                "Recommended Actions": [f["Suggested Fix"] for f in fixations]
            }
        }

        return JSONResponse(content=response)

    except KeyError as e:
        raise HTTPException(status_code=500, detail=f"Error accessing dataset column: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in component fixation analysis: {str(e)}")
