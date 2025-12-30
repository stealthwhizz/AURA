import Navbar from '../components/Navbar';

function Profile({ farmer, onLogout }) {
  // Fallback to demo data if farmer is not available
  const farmerData = farmer || {
    name: 'Demo Farmer',
    email: 'demo@example.com',
    phone: '+911234567890',
    location: {
      latitude: 15.3173,
      longitude: 75.7139,
      address: 'Demo Village, Karnataka, India'
    },
    crops: [{
      type: 'maize',
      area: 5,
      storageType: 'silo'
    }]
  };

  return (
    <div>
      <Navbar farmer={farmerData} onLogout={onLogout} />
      <div className="container">
        <div className="page-header">
          <h1>👤 Farmer Profile</h1>
        </div>

        <div className="card profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              🌾
            </div>
            <div className="profile-info">
              <h2>{farmerData.name}</h2>
              <p className="profile-subtitle">Registered Farmer</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-section">
              <h3>Contact Information</h3>
              <div className="detail-row">
                <span className="detail-label">📧 Email:</span>
                <span>{farmerData.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">📱 Phone:</span>
                <span>{farmerData.phone}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Location</h3>
              <div className="detail-row">
                <span className="detail-label">📍 Address:</span>
                <span>{farmerData.location?.address || 'Not set'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">🗺️ Coordinates:</span>
                <span>{farmerData.location?.latitude}, {farmerData.location?.longitude}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Crop Information</h3>
              {farmerData.crops && farmerData.crops.length > 0 ? (
                farmerData.crops.map((crop, index) => (
                  <div key={index} className="crop-item">
                    <div className="detail-row">
                      <span className="detail-label">🌱 Crop Type:</span>
                      <span>{crop.type}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">📏 Area:</span>
                      <span>{crop.area} acres</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">🏠 Storage Type:</span>
                      <span>{crop.storageType}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No crop information available</p>
              )}
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn btn-secondary">✏️ Edit Profile</button>
            <button className="btn btn-secondary">🔒 Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
