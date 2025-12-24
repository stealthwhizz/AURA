// AURA API wrapper
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('aura_token', token);
    } else {
      localStorage.removeItem('aura_token');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('aura_token');
    }
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    location: string;
    crops: string[];
  }) {
    const result = await this.request<{ token: string; farmer: Farmer }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(result.token);
    return result;
  }

  async login(email: string, password: string) {
    const result = await this.request<{ token: string; farmer: Farmer }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(result.token);
    return result;
  }

  logout() {
    this.setToken(null);
  }

  // Farmer endpoints
  async getFarmer(id: string) {
    return this.request<Farmer>(`/farmers/${id}`);
  }

  async updateFarmer(id: string, data: Partial<Farmer>) {
    return this.request<Farmer>(`/farmers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Prediction endpoints
  async createPrediction(data: {
    farmerId: string;
    latitude: number;
    longitude: number;
    storageType: string;
    storageQuality: string;
    moistureContent: number;
  }) {
    return this.request<PredictionResponse>('/predictions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPredictionHistory(farmerId: string, limit = 20) {
    return this.request<Prediction[]>(`/predictions/history/${farmerId}?limit=${limit}`);
  }

  // Alert endpoints
  async getAlerts(farmerId: string, unreadOnly = false) {
    return this.request<Alert[]>(`/alerts/${farmerId}?unreadOnly=${unreadOnly}`);
  }

  async markAlertRead(alertId: string) {
    return this.request<Alert>(`/alerts/${alertId}/read`, { method: 'PUT' });
  }

  async acknowledgeAlert(alertId: string) {
    return this.request<Alert>(`/alerts/${alertId}/acknowledge`, { method: 'PUT' });
  }

  async getAlertStats(farmerId: string) {
    return this.request<AlertStats>(`/alerts/${farmerId}/stats`);
  }

  // Certification endpoints
  async createCertification(data: {
    farmerId: string;
    cropType: string;
    quantity: number;
    harvestDate?: string;
    predictions: string[];
    interventions?: string;
  }) {
    return this.request<CertificationResponse>('/certifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyCertification(batchId: string) {
    return this.request<Certification>(`/certifications/verify/${batchId}`);
  }

  async getFarmerCertifications(farmerId: string) {
    return this.request<Certification[]>(`/certifications/farmer/${farmerId}`);
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

// Types
export interface Farmer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  crops: string[];
  alertPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  createdAt: string;
  walletAddress?: string;
}

export interface Prediction {
  _id: string;
  farmer: string;
  location: {
    latitude: number;
    longitude: number;
  };
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number;
  recommendations: string[];
  storageType: string;
  storageQuality: string;
  moistureContent: number;
  createdAt: string;
}

export interface PredictionResponse {
  prediction: Prediction;
  recommendations: string[];
  forecast: {
    nextWeek: number;
    trend: 'improving' | 'stable' | 'worsening';
  };
}

export interface Alert {
  _id: string;
  farmer: string;
  prediction: string;
  type: 'risk_warning' | 'action_required' | 'info';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  isRead: boolean;
  isAcknowledged: boolean;
  createdAt: string;
}

export interface AlertStats {
  total: number;
  unread: number;
  bySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface Certification {
  _id: string;
  batchId: string;
  farmer: string;
  cropType: string;
  quantity: number;
  harvestDate?: string;
  averageRiskScore: number;
  status: 'valid' | 'revoked';
  verificationUrl: string;
  blockchainTxHash?: string;
  createdAt: string;
}

export interface CertificationResponse {
  certification: Certification;
  qrCode: string;
}

export const api = new ApiClient();
