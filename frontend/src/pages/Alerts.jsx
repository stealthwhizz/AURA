import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { alertService } from '../services/api';

function Alerts({ farmer, onLogout }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await alertService.getAlerts(farmer?.id || 'demo-123');
      setAlerts(data);
    } catch (error) {
      console.error('Failed to load alerts:', error);
      setError('Unable to load alerts. Service may be unavailable.');
      // Set demo data
      setAlerts([
        {
          id: 'demo-1',
          title: 'High Risk Alert',
          message: 'Your stored maize shows elevated risk levels. Immediate action recommended.',
          type: 'RISK',
          severity: 'HIGH',
          read: false,
          acknowledged: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'demo-2',
          title: 'Weather Warning',
          message: 'Heavy rainfall expected in your area. Check storage conditions.',
          type: 'WEATHER',
          severity: 'MODERATE',
          read: true,
          acknowledged: false,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'demo-3',
          title: 'Maintenance Reminder',
          message: 'Time to inspect your storage facilities for optimal conditions.',
          type: 'MAINTENANCE',
          severity: 'LOW',
          read: false,
          acknowledged: true,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId) => {
    try {
      await alertService.markAsRead(alertId);
      setAlerts(alerts.map(alert =>
        alert.id === alertId ? { ...alert, read: true } : alert
      ));
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
      // Fallback: update locally
      setAlerts(alerts.map(alert =>
        alert.id === alertId ? { ...alert, read: true } : alert
      ));
    }
  };

  const acknowledgeAlert = async (alertId) => {
    try {
      await alertService.acknowledge(alertId);
      setAlerts(alerts.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ));
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
      // Fallback: update locally
      setAlerts(alerts.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ));
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH': return '#dc3545';
      case 'MODERATE': return '#ffc107';
      case 'LOW': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'RISK': return '⚠️';
      case 'WEATHER': return '🌧️';
      case 'MAINTENANCE': return '🔧';
      default: return '📢';
    }
  };

  if (loading && alerts.length === 0) {
    return (
      <div>
        <Navbar farmer={farmer} onLogout={onLogout} />
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <div>
      <Navbar farmer={farmer} onLogout={onLogout} />
      <div className="container">
        <div className="page-header">
          <h1>🔔 Alerts & Notifications</h1>
          <div className="alert-stats">
            <span className="unread-count">{unreadCount} unread</span>
            <button onClick={loadAlerts} className="btn btn-secondary">
              🔄 Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="card error-card">
            <h3>⚠️ Service Notice</h3>
            <p>{error}</p>
            <p>Showing demo data for illustration purposes.</p>
          </div>
        )}

        <div className="alerts-list">
          {alerts.length === 0 ? (
            <div className="card">
              <p>No alerts available. You'll receive notifications here when important events occur.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={`card alert-card ${!alert.read ? 'unread' : ''}`}>
                <div className="alert-header">
                  <div className="alert-title">
                    <span className="alert-icon">{getTypeIcon(alert.type)}</span>
                    <h3>{alert.title}</h3>
                  </div>
                  <div className="alert-meta">
                    <span
                      className="severity-badge"
                      style={{ backgroundColor: getSeverityColor(alert.severity) }}
                    >
                      {alert.severity}
                    </span>
                    <span className="alert-date">
                      {new Date(alert.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="alert-content">
                  <p>{alert.message}</p>
                </div>

                <div className="alert-actions">
                  {!alert.read && (
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="btn btn-sm"
                    >
                      Mark as Read
                    </button>
                  )}
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="btn btn-sm btn-primary"
                    >
                      Acknowledge
                    </button>
                  )}
                  {alert.acknowledged && (
                    <span className="acknowledged-badge">✓ Acknowledged</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Alerts;
