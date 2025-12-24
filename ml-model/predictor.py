"""
AURA ML Model: Aflatoxin Risk Prediction Engine
Uses LSTM neural network with multi-stream data fusion
"""

import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from datetime import datetime, timedelta
import joblib
import os

class AuraPredictor:
    """
    Main prediction engine for aflatoxin contamination risk
    Processes satellite imagery, weather data, and storage conditions
    """
    
    def __init__(self, model_path=None):
        self.model = None
        self.scaler = None
        self.model_path = model_path
        
        # Risk thresholds
        self.CRITICAL_THRESHOLD = 8.0
        self.HIGH_THRESHOLD = 6.0
        self.MODERATE_THRESHOLD = 4.0
        
    def build_model(self, sequence_length=48, feature_count=15):
        """
        Build LSTM model architecture for time-series prediction
        
        Args:
            sequence_length: Number of time steps to look back (48 hours)
            feature_count: Number of input features per timestep
        """
        model = keras.Sequential([
            # First LSTM layer with return sequences
            layers.LSTM(128, return_sequences=True, input_shape=(sequence_length, feature_count)),
            layers.Dropout(0.3),
            
            # Second LSTM layer
            layers.LSTM(64, return_sequences=True),
            layers.Dropout(0.3),
            
            # Third LSTM layer
            layers.LSTM(32),
            layers.Dropout(0.2),
            
            # Dense layers for final prediction
            layers.Dense(16, activation='relu'),
            layers.Dense(8, activation='relu'),
            
            # Output: Aflatoxin Risk Score (1-10)
            layers.Dense(1, activation='linear')
        ])
        
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss='mse',
            metrics=['mae']
        )
        
        self.model = model
        return model
    
    def preprocess_data(self, satellite_data, weather_data, storage_data):
        """
        Fuse multiple data streams into unified feature vector
        
        Args:
            satellite_data: Sentinel-2 crop stress indicators (NDVI, NDMI, etc.)
            weather_data: Temperature, humidity, rainfall forecasts
            storage_data: Storage type, ventilation, moisture content
            
        Returns:
            Preprocessed feature array ready for model input
        """
        features = []
        
        # Satellite features (7 features)
        if satellite_data:
            features.extend([
                satellite_data.get('ndvi', 0.5),          # Normalized Difference Vegetation Index
                satellite_data.get('ndmi', 0.5),          # Normalized Difference Moisture Index
                satellite_data.get('crop_health', 0.5),   # Overall crop health score
                satellite_data.get('stress_level', 0.0),  # Crop stress indicator
                satellite_data.get('canopy_water', 0.5),  # Canopy water content
                satellite_data.get('chlorophyll', 0.5),   # Chlorophyll content
                satellite_data.get('temperature_surface', 25.0)  # Surface temperature
            ])
        else:
            features.extend([0.5] * 7)  # Default values
        
        # Weather features (5 features)
        if weather_data:
            features.extend([
                weather_data.get('temperature', 25.0),
                weather_data.get('humidity', 60.0) / 100.0,  # Normalize to 0-1
                weather_data.get('rainfall', 0.0),
                weather_data.get('wind_speed', 5.0),
                weather_data.get('dew_point', 15.0)
            ])
        else:
            features.extend([25.0, 0.6, 0.0, 5.0, 15.0])
        
        # Storage features (3 features)
        if storage_data:
            storage_types = {'silo': 0.2, 'bag': 0.5, 'warehouse': 0.3, 'open': 0.8}
            features.extend([
                storage_types.get(storage_data.get('type', 'bag'), 0.5),
                storage_data.get('ventilation_score', 0.5),
                storage_data.get('moisture_content', 12.0) / 20.0  # Normalize
            ])
        else:
            features.extend([0.5, 0.5, 0.6])
        
        return np.array(features)
    
    def predict_risk(self, data_sequence):
        """
        Generate Aflatoxin Risk Score (ARS) from data sequence
        
        Args:
            data_sequence: Time-series array of preprocessed features
            
        Returns:
            Risk score (1-10) and risk level classification
        """
        if self.model is None:
            # Use synthetic model for demo (replace with trained model)
            return self._synthetic_prediction(data_sequence)
        
        # Reshape for LSTM input: (batch_size, timesteps, features)
        input_data = np.expand_dims(data_sequence, axis=0)
        
        # Get prediction
        raw_score = self.model.predict(input_data, verbose=0)[0][0]
        
        # Clip to 1-10 range
        risk_score = np.clip(raw_score, 1.0, 10.0)
        
        # Classify risk level
        risk_level = self._classify_risk(risk_score)
        
        return {
            'risk_score': float(risk_score),
            'risk_level': risk_level,
            'timestamp': datetime.now().isoformat(),
            'confidence': 0.85  # Model confidence score
        }
    
    def _synthetic_prediction(self, data_sequence):
        """
        Synthetic prediction model for demo/testing
        Uses rule-based logic until trained model is available
        """
        # Extract latest features
        latest = data_sequence[-1] if len(data_sequence) > 0 else np.zeros(15)
        
        # Rule-based risk calculation
        humidity = latest[8] if len(latest) > 8 else 0.6
        temperature = latest[7] if len(latest) > 7 else 25.0
        storage_quality = latest[13] if len(latest) > 13 else 0.5
        moisture = latest[14] if len(latest) > 14 else 0.6
        
        # Risk factors
        risk = 1.0
        
        # High humidity increases risk significantly
        if humidity > 0.75:
            risk += 3.5
        elif humidity > 0.65:
            risk += 2.0
        
        # Temperature in danger zone (25-35°C)
        if 25 <= temperature <= 35:
            risk += 2.5
        elif 20 <= temperature <= 40:
            risk += 1.5
        
        # Poor storage increases risk
        if storage_quality > 0.6:  # Higher value = worse storage
            risk += 1.5
        
        # High moisture content
        if moisture > 0.65:  # >13% moisture
            risk += 1.5
        
        risk_score = min(risk, 10.0)
        risk_level = self._classify_risk(risk_score)
        
        return {
            'risk_score': float(risk_score),
            'risk_level': risk_level,
            'timestamp': datetime.now().isoformat(),
            'confidence': 0.75,
            'note': 'Using synthetic model - train with real data for production'
        }
    
    def _classify_risk(self, score):
        """Classify numerical risk score into categorical level"""
        if score >= self.CRITICAL_THRESHOLD:
            return 'CRITICAL'
        elif score >= self.HIGH_THRESHOLD:
            return 'HIGH'
        elif score >= self.MODERATE_THRESHOLD:
            return 'MODERATE'
        else:
            return 'LOW'
    
    def generate_recommendations(self, risk_data):
        """
        Generate actionable recommendations based on risk level
        
        Returns:
            List of specific actions farmer should take
        """
        risk_level = risk_data['risk_level']
        score = risk_data['risk_score']
        
        recommendations = []
        
        if risk_level == 'CRITICAL':
            recommendations = [
                "🚨 IMMEDIATE ACTION REQUIRED",
                "Deploy moisture-absorbing desiccants (silica gel/calcium chloride) in storage area",
                "Ensure maximum ventilation - open all vents and use fans if available",
                "Move produce to cooler, drier storage immediately if possible",
                "Reduce storage density to improve air circulation",
                "Consider emergency drying using mechanical dryers",
                "Test samples for aflatoxin contamination within 24 hours"
            ]
        elif risk_level == 'HIGH':
            recommendations = [
                "⚠️ HIGH RISK - Take preventive action within 24 hours",
                "Increase ventilation in storage area",
                "Deploy drying beads or moisture control agents",
                "Monitor temperature and humidity every 6 hours",
                "Inspect produce for visible mold or discoloration",
                "Prepare for possible relocation to better storage"
            ]
        elif risk_level == 'MODERATE':
            recommendations = [
                "⚡ MODERATE RISK - Monitor closely and prepare",
                "Check storage ventilation systems are functioning",
                "Keep drying materials ready for deployment",
                "Monitor weather forecasts for humidity spikes",
                "Inspect storage area for moisture accumulation",
                "Plan for increased monitoring over next 48 hours"
            ]
        else:
            recommendations = [
                "✅ LOW RISK - Maintain current practices",
                "Continue routine monitoring",
                "Keep storage area clean and well-ventilated",
                "Monitor for changes in weather conditions"
            ]
        
        return {
            'risk_level': risk_level,
            'risk_score': score,
            'actions': recommendations,
            'priority': 'URGENT' if score >= 8 else 'HIGH' if score >= 6 else 'NORMAL'
        }
    
    def save_model(self, path):
        """Save trained model to disk"""
        if self.model:
            self.model.save(path)
            print(f"Model saved to {path}")
    
    def load_model(self, path):
        """Load trained model from disk"""
        if os.path.exists(path):
            self.model = keras.models.load_model(path)
            print(f"Model loaded from {path}")
        else:
            print(f"Model file not found: {path}")


if __name__ == "__main__":
    # Demo usage
    print("AURA Prediction Engine - Demo")
    print("=" * 50)
    
    predictor = AuraPredictor()
    
    # Simulate data for demonstration
    sample_satellite = {
        'ndvi': 0.6,
        'ndmi': 0.5,
        'crop_health': 0.7,
        'stress_level': 0.3
    }
    
    sample_weather = {
        'temperature': 32.0,
        'humidity': 78.0,
        'rainfall': 0.0
    }
    
    sample_storage = {
        'type': 'bag',
        'ventilation_score': 0.4,
        'moisture_content': 14.0
    }
    
    # Create time series (48 hours of data)
    sequence = []
    for i in range(48):
        features = predictor.preprocess_data(
            sample_satellite, 
            sample_weather, 
            sample_storage
        )
        sequence.append(features)
    
    sequence = np.array(sequence)
    
    # Get prediction
    risk_data = predictor.predict_risk(sequence)
    
    print(f"\nRisk Assessment:")
    print(f"  Score: {risk_data['risk_score']:.1f}/10")
    print(f"  Level: {risk_data['risk_level']}")
    print(f"  Confidence: {risk_data['confidence']*100:.0f}%")
    
    # Get recommendations
    recommendations = predictor.generate_recommendations(risk_data)
    
    print(f"\nRecommendations ({recommendations['priority']} priority):")
    for action in recommendations['actions']:
        print(f"  • {action}")
