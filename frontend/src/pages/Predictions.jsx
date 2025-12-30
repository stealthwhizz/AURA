import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { predictionService } from '../services/api';

function Predictions({ farmer, onLogout }) {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await predictionService.getHistory(farmer?.id || 'demo-123');
      setPredictions(data);
    } catch (error) {
      console.error('Failed to load predictions:', error);
      setError('Unable to load prediction history. ML service may be unavailable.');
      // Set demo data
      setPredictions([
        {
          id: 'demo-1',
          riskScore: 5.5,
          riskLevel: 'MODERATE',
          confidence: 0.75,
          createdAt: new Date().toISOString(),
          weatherData: { temperature: 28, humidity: 65 },
          satelliteData: { cropHealth: 0.8 },
          recommendations: [
            { action: 'Monitor humidity levels closely' },
            { action: 'Ensure proper ventilation' }
          ]
        },
        {
          id: 'demo-2',
          riskScore: 7.2,
          riskLevel: 'HIGH',
          confidence: 0.82,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          weatherData: { temperature: 32, humidity: 70 },
          satelliteData: { cropHealth: 0.6 },
          recommendations: [
            { action: 'Immediate action required' },
            { action: 'Check storage conditions' }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'LOW': return '#28a745';
      case 'MODERATE': return '#ffc107';
      case 'HIGH': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading && predictions.length === 0) {
    return (
      <div>
        <Navbar farmer={farmer} onLogout={onLogout} />
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar farmer={farmer} onLogout={onLogout} />
      <div className="container">
        <div className="page-header">
          <h1>📊 Prediction History</h1>
          <button onClick={loadPredictions} className="btn btn-secondary">
            🔄 Refresh
          </button>
        </div>

        {error && (
          <div className="card error-card">
            <h3>⚠️ Service Notice</h3>
            <p>{error}</p>
            <p>Showing demo data for illustration purposes.</p>
          </div>
        )}

        <div className="predictions-grid">
          {predictions.length === 0 ? (
            <div className="card">
              <p>No predictions available yet. Predictions will appear here once generated.</p>
            </div>
          ) : (
            predictions.map((prediction) => (
              <div key={prediction.id} className="card prediction-card">
                <div className="prediction-header">
                  <h3>Risk Assessment</h3>
                  <span
                    className="risk-badge"
                    style={{ backgroundColor: getRiskColor(prediction.riskLevel) }}
                  >
                    {prediction.riskLevel}
                  </span>
                </div>

                <div className="prediction-details">
                  <div className="detail-row">
                    <span>Risk Score:</span>
                    <span>{prediction.riskScore}/10</span>
                  </div>
                  <div className="detail-row">
                    <span>Confidence:</span>
                    <span>{Math.round(prediction.confidence * 100)}%</span>
                  </div>
                  <div className="detail-row">
                    <span>Date:</span>
                    <span>{new Date(prediction.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {prediction.weatherData && (
                  <div className="weather-data">
                    <h4>Weather Conditions</h4>
                    <div className="detail-row">
                      <span>Temperature:</span>
                      <span>{prediction.weatherData.temperature}°C</span>
                    </div>
                    <div className="detail-row">
                      <span>Humidity:</span>
                      <span>{prediction.weatherData.humidity}%</span>
                    </div>
                  </div>
                )}

                {prediction.recommendations && prediction.recommendations.length > 0 && (
                  <div className="recommendations">
                    <h4>Recommendations</h4>
                    <ul>
                      {prediction.recommendations.map((rec, index) => (
                        <li key={index}>{rec.action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Predictions;
