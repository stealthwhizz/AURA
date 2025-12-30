import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { certificationService } from '../services/api';

function Certifications({ farmer, onLogout }) {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await certificationService.getFarmerCertifications(farmer?.id || 'demo-123');
      setCertifications(data);
    } catch (error) {
      console.error('Failed to load certifications:', error);
      setError('Unable to load certifications. Blockchain service may be unavailable.');
      // Set demo data
      setCertifications([
        {
          id: 'demo-1',
          batchId: 'BATCH-2024-001',
          cropType: 'maize',
          quantity: 500,
          quality: 'Premium',
          certificationDate: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          blockchainHash: '0x1234567890abcdef',
          status: 'VERIFIED'
        },
        {
          id: 'demo-2',
          batchId: 'BATCH-2024-002',
          cropType: 'wheat',
          quantity: 300,
          quality: 'Standard',
          certificationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
          blockchainHash: '0xabcdef1234567890',
          status: 'VERIFIED'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateCertification = async (certData) => {
    try {
      setGenerating(true);
      const newCert = await certificationService.generateCertification({
        farmerId: farmer?.id || 'demo-123',
        ...certData
      });
      setCertifications([newCert, ...certifications]);
      setShowGenerateForm(false);
    } catch (error) {
      console.error('Failed to generate certification:', error);
      alert('Failed to generate certification. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const verifyCertification = async (batchId) => {
    try {
      const result = await certificationService.verifyCertification(batchId);
      alert(`Certification ${batchId} is ${result.verified ? 'VALID' : 'INVALID'}`);
    } catch (error) {
      console.error('Failed to verify certification:', error);
      alert('Failed to verify certification. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED': return '#28a745';
      case 'PENDING': return '#ffc107';
      case 'REJECTED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading && certifications.length === 0) {
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
          <h1>✅ AURA Certifications</h1>
          <button
            onClick={() => setShowGenerateForm(!showGenerateForm)}
            className="btn btn-primary"
          >
            {showGenerateForm ? 'Cancel' : '+ Generate Certificate'}
          </button>
        </div>

        {error && (
          <div className="card error-card">
            <h3>⚠️ Service Notice</h3>
            <p>{error}</p>
            <p>Showing demo data for illustration purposes.</p>
          </div>
        )}

        {showGenerateForm && (
          <div className="card">
            <h3>Generate New Certificate</h3>
            <GenerateCertForm
              onSubmit={generateCertification}
              onCancel={() => setShowGenerateForm(false)}
              loading={generating}
              farmer={farmer}
            />
          </div>
        )}

        <div className="certifications-grid">
          {certifications.length === 0 ? (
            <div className="card">
              <p>No certifications available yet. Generate your first blockchain-backed certificate above.</p>
            </div>
          ) : (
            certifications.map((cert) => (
              <div key={cert.id} className="card cert-card">
                <div className="cert-header">
                  <h3>Batch {cert.batchId}</h3>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(cert.status) }}
                  >
                    {cert.status}
                  </span>
                </div>

                <div className="cert-details">
                  <div className="detail-row">
                    <span>Crop Type:</span>
                    <span>{cert.cropType}</span>
                  </div>
                  <div className="detail-row">
                    <span>Quantity:</span>
                    <span>{cert.quantity} kg</span>
                  </div>
                  <div className="detail-row">
                    <span>Quality:</span>
                    <span>{cert.quality}</span>
                  </div>
                  <div className="detail-row">
                    <span>Certified:</span>
                    <span>{new Date(cert.certificationDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <span>Expires:</span>
                    <span>{new Date(cert.expiryDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="blockchain-info">
                  <h4>Blockchain Verification</h4>
                  <div className="hash-display">
                    <small>Hash: {cert.blockchainHash}</small>
                  </div>
                </div>

                <div className="cert-actions">
                  <button
                    onClick={() => verifyCertification(cert.batchId)}
                    className="btn btn-sm"
                  >
                    🔍 Verify
                  </button>
                  <button className="btn btn-sm btn-secondary">
                    📄 Download
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function GenerateCertForm({ onSubmit, onCancel, loading, farmer }) {
  const [formData, setFormData] = useState({
    cropType: farmer?.crops?.[0]?.type || 'maize',
    quantity: '',
    quality: 'Standard',
    storageConditions: {
      temperature: '',
      humidity: '',
      ventilation: 'good'
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cert-form">
      <div className="form-row">
        <div className="form-group">
          <label>Crop Type</label>
          <select name="cropType" value={formData.cropType} onChange={handleChange} required>
            <option value="maize">Maize</option>
            <option value="wheat">Wheat</option>
            <option value="rice">Rice</option>
            <option value="soybean">Soybean</option>
          </select>
        </div>
        <div className="form-group">
          <label>Quantity (kg)</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Quality Grade</label>
          <select name="quality" value={formData.quality} onChange={handleChange} required>
            <option value="Premium">Premium</option>
            <option value="Standard">Standard</option>
            <option value="Basic">Basic</option>
          </select>
        </div>
      </div>

      <div className="storage-conditions">
        <h4>Storage Conditions</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Temperature (°C)</label>
            <input
              type="number"
              name="storageConditions.temperature"
              value={formData.storageConditions.temperature}
              onChange={handleChange}
              placeholder="25"
            />
          </div>
          <div className="form-group">
            <label>Humidity (%)</label>
            <input
              type="number"
              name="storageConditions.humidity"
              value={formData.storageConditions.humidity}
              onChange={handleChange}
              placeholder="60"
            />
          </div>
          <div className="form-group">
            <label>Ventilation</label>
            <select
              name="storageConditions.ventilation"
              value={formData.storageConditions.ventilation}
              onChange={handleChange}
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Certificate'}
        </button>
      </div>
    </form>
  );
}

export default Certifications;
