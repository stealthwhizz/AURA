import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('aura_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  
  register: async (farmerData) => {
    const response = await api.post('/api/auth/register', farmerData);
    return response.data;
  }
};

export const predictionService = {
  getPrediction: async (farmerId, latitude, longitude, storageData) => {
    const response = await api.post('/api/predictions', {
      farmerId,
      latitude,
      longitude,
      ...storageData
    });
    return response.data;
  },
  
  getHistory: async (farmerId, limit = 20) => {
    const response = await api.get(`/api/predictions/history/${farmerId}?limit=${limit}`);
    return response.data;
  }
};

export const alertService = {
  getAlerts: async (farmerId, unreadOnly = false) => {
    const response = await api.get(`/api/alerts/${farmerId}?unreadOnly=${unreadOnly}`);
    return response.data;
  },
  
  markAsRead: async (alertId) => {
    const response = await api.put(`/api/alerts/${alertId}/read`);
    return response.data;
  },
  
  acknowledge: async (alertId) => {
    const response = await api.put(`/api/alerts/${alertId}/acknowledge`);
    return response.data;
  }
};

export const certificationService = {
  generateCertification: async (certData) => {
    const response = await api.post('/api/certifications', certData);
    return response.data;
  },
  
  verifyCertification: async (batchId) => {
    const response = await api.get(`/api/certifications/verify/${batchId}`);
    return response.data;
  },
  
  getFarmerCertifications: async (farmerId) => {
    const response = await api.get(`/api/certifications/farmer/${farmerId}`);
    return response.data;
  }
};

export const farmerService = {
  getProfile: async (farmerId) => {
    const response = await api.get(`/api/farmers/${farmerId}`);
    return response.data;
  },
  
  updateProfile: async (farmerId, updates) => {
    const response = await api.put(`/api/farmers/${farmerId}`, updates);
    return response.data;
  }
};

export default api;
