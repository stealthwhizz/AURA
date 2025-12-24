"""
Data Integration Module
Fetches data from Sentinel-2 satellite API and weather services
"""

import requests
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

class DataIntegrator:
    """Handles all external data source integrations"""
    
    def __init__(self):
        self.sentinel_api_key = os.getenv('SENTINEL_API_KEY', '')
        self.weather_api_key = os.getenv('WEATHER_API_KEY', '')
        
    def fetch_satellite_data(self, latitude, longitude, date=None):
        """
        Fetch Sentinel-2 satellite imagery data for crop analysis
        
        Args:
            latitude: Farm location latitude
            longitude: Farm location longitude
            date: Date for satellite imagery (default: today)
            
        Returns:
            Dictionary with crop health indicators
        """
        if date is None:
            date = datetime.now().strftime('%Y-%m-%d')
        
        # Note: In production, integrate with actual Sentinel Hub API
        # https://www.sentinel-hub.com/
        
        # Synthetic data for demo
        print(f"Fetching satellite data for ({latitude}, {longitude}) on {date}")
        
        return {
            'ndvi': 0.65,  # Vegetation health (0-1)
            'ndmi': 0.55,  # Moisture index
            'crop_health': 0.7,
            'stress_level': 0.3,
            'canopy_water': 0.6,
            'chlorophyll': 0.68,
            'temperature_surface': 28.5,
            'timestamp': date
        }
    
    def fetch_weather_data(self, latitude, longitude, forecast_hours=72):
        """
        Fetch weather data and forecast
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            forecast_hours: Hours of forecast to retrieve
            
        Returns:
            Dictionary with weather data and forecasts
        """
        # Note: In production, integrate with OpenWeatherMap or similar
        # API endpoint: https://api.openweathermap.org/data/2.5/forecast
        
        print(f"Fetching weather forecast for ({latitude}, {longitude})")
        
        # Synthetic data for demo
        current_weather = {
            'temperature': 31.0,
            'humidity': 75.0,
            'rainfall': 0.0,
            'wind_speed': 8.5,
            'dew_point': 23.5,
            'pressure': 1012.0,
            'timestamp': datetime.now().isoformat()
        }
        
        # Generate forecast (simplified)
        forecast = []
        for hour in range(1, forecast_hours + 1):
            forecast.append({
                'hour': hour,
                'temperature': 31.0 - (hour % 24) * 0.3,
                'humidity': 75.0 + (hour % 12) * 1.5,
                'rainfall': 0.0 if hour % 18 > 6 else 2.5,
                'timestamp': (datetime.now() + timedelta(hours=hour)).isoformat()
            })
        
        return {
            'current': current_weather,
            'forecast': forecast,
            'location': {'lat': latitude, 'lon': longitude}
        }
    
    def calculate_risk_factors(self, satellite_data, weather_data):
        """
        Calculate derived risk factors from raw data
        
        Returns:
            Risk factor metrics
        """
        # Fungal growth optimal conditions
        temp = weather_data['current']['temperature']
        humidity = weather_data['current']['humidity']
        
        # Aflatoxin risk increases in specific conditions
        temp_risk = 1.0
        if 25 <= temp <= 35:  # Optimal fungal growth
            temp_risk = 1.5
        elif temp > 35:
            temp_risk = 0.8  # Less favorable
        
        humidity_risk = 1.0
        if humidity > 70:
            humidity_risk = 1.8
        elif humidity > 60:
            humidity_risk = 1.3
        
        # Crop stress increases susceptibility
        stress = satellite_data.get('stress_level', 0.0)
        stress_risk = 1.0 + (stress * 0.5)
        
        combined_risk = temp_risk * humidity_risk * stress_risk
        
        return {
            'temperature_risk': temp_risk,
            'humidity_risk': humidity_risk,
            'crop_stress_risk': stress_risk,
            'combined_risk_multiplier': combined_risk,
            'assessment': 'HIGH' if combined_risk > 2.0 else 'MODERATE' if combined_risk > 1.5 else 'LOW'
        }


# Example usage
if __name__ == "__main__":
    integrator = DataIntegrator()
    
    # Example coordinates (Karnataka, India)
    lat, lon = 15.3173, 75.7139
    
    print("Fetching data for risk assessment...")
    print("=" * 50)
    
    satellite = integrator.fetch_satellite_data(lat, lon)
    weather = integrator.fetch_weather_data(lat, lon)
    risk_factors = integrator.calculate_risk_factors(satellite, weather)
    
    print(f"\nSatellite Indicators:")
    print(f"  Crop Health: {satellite['crop_health']:.2f}")
    print(f"  NDVI: {satellite['ndvi']:.2f}")
    print(f"  Stress Level: {satellite['stress_level']:.2f}")
    
    print(f"\nCurrent Weather:")
    print(f"  Temperature: {weather['current']['temperature']:.1f}°C")
    print(f"  Humidity: {weather['current']['humidity']:.1f}%")
    print(f"  Rainfall: {weather['current']['rainfall']:.1f}mm")
    
    print(f"\nRisk Assessment:")
    print(f"  Combined Risk Multiplier: {risk_factors['combined_risk_multiplier']:.2f}")
    print(f"  Risk Level: {risk_factors['assessment']}")
