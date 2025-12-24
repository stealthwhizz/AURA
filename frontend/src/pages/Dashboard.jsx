import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import RiskCard from '../components/RiskCard';
import { predictionService, alertService } from '../services/api';
import './Dashboard.css';

function Dashboard({ farmer, onLogout }) {
  const [prediction, setPrediction] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [farmer]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get latest prediction
      const predictionData = await predictionService.getPrediction(
        farmer.id,
        farmer.location.latitude,
        farmer.location.longitude,
        { storageType: 'bag', storageQuality: 0.5, moistureContent: 12.0 }
      );
      setPrediction(predictionData.prediction);
      
      // Get recent alerts
      const alertsData = await alertService.getAlerts(farmer.id);
      setAlerts(alertsData.slice(0, 5));
      
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  if (loading) {
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
    <div className="dashboard">
      <Navbar farmer={farmer} onLogout={onLogout} />
      
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {farmer.name}! 🌾</h1>
          <button onClick={handleRefresh} className="btn btn-secondary">
            🔄 Refresh Data
          </button>
        </div>
        
        <div className="dashboard-grid">
          <div className="dashboard-main">
            {prediction && <RiskCard prediction={prediction} />}
            
            <div className="card">
              <h2>Quick Actions</h2>
              <div className="quick-actions">
                <a href="/predictions" className="action-btn">
                  📊 View Predictions
                </a>
                <a href="/alerts" className="action-btn">
                  🔔 Check Alerts ({alerts.filter(a => !a.read).length})
                </a>
                <a href="/certifications" className="action-btn">
                  ✅ Certifications
                </a>
              </div>
            </div>
          </div>
          
          <div className="dashboard-sidebar">
            <div className="card">
              <h3>Recent Alerts</h3>
              {alerts.length === 0 ? (
                <p className="no-data">No alerts</p>
              ) : (
                <div className="alert-list">
                  {alerts.map(alert => (
                    <div key={alert._id} className={`alert-item ${alert.severity.toLowerCase()}`}>
                      <div className="alert-title">{alert.title}</div>
                      <div className="alert-time">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <a href="/alerts" className="view-all">View All Alerts →</a>
            </div>
            
            <div className="card">
              <h3>Farm Info</h3>
              <div className="farm-info">
                <div className="info-item">
                  <span className="label">Location:</span>
                  <span>{farmer.location.address || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Coordinates:</span>
                  <span>{farmer.location.latitude.toFixed(4)}, {farmer.location.longitude.toFixed(4)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Crops:</span>
                  <span>{farmer.crops?.map(c => c.type).join(', ') || 'None'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
