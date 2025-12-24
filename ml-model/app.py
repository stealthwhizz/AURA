"""
Flask API for ML Model
Exposes prediction endpoints for backend integration
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from predictor import AuraPredictor
from data_integrator import DataIntegrator
import numpy as np
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Initialize predictor and data integrator
predictor = AuraPredictor()
integrator = DataIntegrator()

@app.route('/health', methods=['GET'])
def health_check():
    """API health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AURA ML API',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/predict', methods=['POST'])
def predict_risk():
    """
    Main prediction endpoint
    
    Request body:
    {
        "latitude": 15.3173,
        "longitude": 75.7139,
        "storage_type": "silo",
        "storage_quality": 0.7,
        "moisture_content": 12.5
    }
    """
    try:
        data = request.json
        
        # Extract parameters
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        storage_type = data.get('storage_type', 'bag')
        ventilation = data.get('storage_quality', 0.5)
        moisture = data.get('moisture_content', 12.0)
        
        if not latitude or not longitude:
            return jsonify({'error': 'Latitude and longitude required'}), 400
        
        # Fetch external data
        satellite_data = integrator.fetch_satellite_data(latitude, longitude)
        weather_data = integrator.fetch_weather_data(latitude, longitude)
        
        # Prepare storage data
        storage_data = {
            'type': storage_type,
            'ventilation_score': ventilation,
            'moisture_content': moisture
        }
        
        # Build time series (use current + forecast data)
        sequence = []
        for i in range(48):  # 48 hours
            features = predictor.preprocess_data(
                satellite_data,
                weather_data['current'],
                storage_data
            )
            sequence.append(features)
        
        sequence = np.array(sequence)
        
        # Get prediction
        risk_result = predictor.predict_risk(sequence)
        
        # Get recommendations
        recommendations = predictor.generate_recommendations(risk_result)
        
        # Calculate risk factors
        risk_factors = integrator.calculate_risk_factors(satellite_data, weather_data)
        
        # Build response
        response = {
            'prediction': risk_result,
            'recommendations': recommendations,
            'risk_factors': risk_factors,
            'data_sources': {
                'satellite': satellite_data,
                'weather': weather_data['current'],
                'storage': storage_data
            },
            'forecast': weather_data['forecast'][:24]  # Next 24 hours
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/forecast', methods=['POST'])
def get_forecast():
    """
    Get extended weather forecast for location
    """
    try:
        data = request.json
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        hours = data.get('hours', 72)
        
        if not latitude or not longitude:
            return jsonify({'error': 'Latitude and longitude required'}), 400
        
        weather_data = integrator.fetch_weather_data(latitude, longitude, hours)
        
        return jsonify(weather_data)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/satellite', methods=['POST'])
def get_satellite():
    """
    Get satellite imagery analysis for location
    """
    try:
        data = request.json
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        date = data.get('date')
        
        if not latitude or not longitude:
            return jsonify({'error': 'Latitude and longitude required'}), 400
        
        satellite_data = integrator.fetch_satellite_data(latitude, longitude, date)
        
        return jsonify(satellite_data)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting AURA ML API Server...")
    print("Endpoints available:")
    print("  POST /api/predict - Get aflatoxin risk prediction")
    print("  POST /api/forecast - Get weather forecast")
    print("  POST /api/satellite - Get satellite analysis")
    print("  GET /health - Health check")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
