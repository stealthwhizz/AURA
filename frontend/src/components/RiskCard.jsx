import './RiskCard.css';

function RiskCard({ prediction }) {
  const getRiskColor = (score) => {
    if (score >= 8) return '#e74c3c';
    if (score >= 6) return '#e67e22';
    if (score >= 4) return '#f39c12';
    return '#2ecc71';
  };

  const getRiskLevel = (level) => {
    const levels = {
      'CRITICAL': '🚨 CRITICAL',
      'HIGH': '⚠️ HIGH',
      'MODERATE': '⚡ MODERATE',
      'LOW': '✅ LOW'
    };
    return levels[level] || level;
  };

  return (
    <div className="card risk-card">
      <h2>Current Aflatoxin Risk Assessment</h2>
      
      <div className="risk-score-container">
        <div 
          className="risk-score-circle"
          style={{ borderColor: getRiskColor(prediction.riskScore) }}
        >
          <div className="risk-score-value" style={{ color: getRiskColor(prediction.riskScore) }}>
            {prediction.riskScore.toFixed(1)}
          </div>
          <div className="risk-score-label">/ 10</div>
        </div>
        
        <div className="risk-info">
          <div className={`risk-badge ${prediction.riskLevel.toLowerCase()}`}>
            {getRiskLevel(prediction.riskLevel)} RISK
          </div>
          <div className="risk-confidence">
            Confidence: {(prediction.confidence * 100).toFixed(0)}%
          </div>
          <div className="risk-timestamp">
            Updated: {new Date(prediction.predictionDate).toLocaleString()}
          </div>
        </div>
      </div>
      
      {prediction.recommendations && prediction.recommendations.length > 0 && (
        <div className="recommendations">
          <h3>Recommended Actions</h3>
          <ul>
            {prediction.recommendations.slice(0, 5).map((rec, idx) => (
              <li key={idx} className="recommendation-item">
                {rec.action}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="risk-factors">
        <h3>Risk Factors</h3>
        <div className="factors-grid">
          <div className="factor">
            <span className="factor-label">🌡️ Temperature</span>
            <span className="factor-value">{prediction.weatherData?.temperature}°C</span>
          </div>
          <div className="factor">
            <span className="factor-label">💧 Humidity</span>
            <span className="factor-value">{prediction.weatherData?.humidity}%</span>
          </div>
          <div className="factor">
            <span className="factor-label">🌾 Crop Health</span>
            <span className="factor-value">{(prediction.satelliteData?.cropHealth * 100).toFixed(0)}%</span>
          </div>
          <div className="factor">
            <span className="factor-label">📦 Storage</span>
            <span className="factor-value">{prediction.storageData?.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskCard;
