# AURA API Documentation

Complete API reference for Project AURA backend.

Base URL: `http://localhost:3000` (development)

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /api/auth/register
Register new farmer account.

**Request Body:**
```json
{
  "name": "John Farmer",
  "email": "john@example.com",
  "phone": "+911234567890",
  "password": "securepassword",
  "location": {
    "latitude": 15.3173,
    "longitude": 75.7139,
    "address": "Village, District, State"
  },
  "crops": [
    {
      "type": "maize",
      "area": 5,
      "storageType": "silo"
    }
  ]
}
```

**Response: 201 Created**
```json
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "farmer": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Farmer",
    "email": "john@example.com",
    "location": { ... }
  }
}
```

#### POST /api/auth/login
Login existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response: 200 OK**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "farmer": { ... }
}
```

---

### Predictions

#### POST /api/predictions
Get aflatoxin risk prediction for farm location.

**Request Body:**
```json
{
  "farmerId": "507f1f77bcf86cd799439011",
  "latitude": 15.3173,
  "longitude": 75.7139,
  "storageType": "silo",
  "storageQuality": 0.7,
  "moistureContent": 12.5
}
```

**Response: 200 OK**
```json
{
  "prediction": {
    "_id": "507f1f77bcf86cd799439012",
    "farmer": "507f1f77bcf86cd799439011",
    "riskScore": 6.5,
    "riskLevel": "HIGH",
    "confidence": 0.85,
    "factors": {
      "temperatureRisk": 1.5,
      "humidityRisk": 1.8,
      "cropStressRisk": 1.3
    },
    "satelliteData": {
      "ndvi": 0.65,
      "cropHealth": 0.7
    },
    "weatherData": {
      "temperature": 32.0,
      "humidity": 78.0
    },
    "recommendations": [
      {
        "priority": "HIGH",
        "action": "Deploy moisture-absorbing desiccants"
      }
    ],
    "predictionDate": "2025-12-11T10:30:00Z"
  },
  "recommendations": { ... },
  "forecast": [ ... ]
}
```

#### GET /api/predictions/history/:farmerId
Get prediction history for farmer.

**Query Parameters:**
- `limit` (optional): Number of predictions to return (default: 20)

**Response: 200 OK**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "riskScore": 6.5,
    "riskLevel": "HIGH",
    "predictionDate": "2025-12-11T10:30:00Z"
  },
  ...
]
```

---

### Alerts

#### GET /api/alerts/:farmerId
Get all alerts for farmer.

**Query Parameters:**
- `unreadOnly` (optional): Filter unread alerts (true/false)

**Response: 200 OK**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "farmer": "507f1f77bcf86cd799439011",
    "type": "RISK_THRESHOLD",
    "severity": "HIGH",
    "title": "⚠️ HIGH AFLATOXIN RISK",
    "message": "Take preventive action within 24 hours. Risk Score: 6.5/10",
    "actions": [
      "Increase ventilation in storage area",
      "Deploy drying beads"
    ],
    "read": false,
    "acknowledged": false,
    "createdAt": "2025-12-11T10:30:00Z"
  }
]
```

#### PUT /api/alerts/:alertId/read
Mark alert as read.

**Response: 200 OK**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "read": true,
  ...
}
```

#### PUT /api/alerts/:alertId/acknowledge
Acknowledge alert (mark as handled).

**Response: 200 OK**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "read": true,
  "acknowledged": true,
  ...
}
```

---

### Certifications

#### POST /api/certifications
Generate AURA certification for crop batch.

**Request Body:**
```json
{
  "farmerId": "507f1f77bcf86cd799439011",
  "cropType": "maize",
  "quantity": 1000,
  "harvestDate": "2025-11-15",
  "predictions": [
    "507f1f77bcf86cd799439012",
    "507f1f77bcf86cd799439014"
  ],
  "interventions": [
    {
      "date": "2025-11-16",
      "action": "Applied moisture control",
      "effectiveness": "Reduced risk by 2 points"
    }
  ]
}
```

**Response: 201 Created**
```json
{
  "message": "Certification generated successfully",
  "certification": {
    "_id": "507f1f77bcf86cd799439015",
    "batchId": "AURA-1702291200-a1b2c3d4",
    "farmer": "507f1f77bcf86cd799439011",
    "cropType": "maize",
    "quantity": 1000,
    "averageRiskScore": 3.5,
    "status": "CERTIFIED",
    "verificationUrl": "https://aura.verify/AURA-1702291200-a1b2c3d4",
    "blockchainTxHash": null,
    "certificationDate": "2025-12-11T10:30:00Z"
  },
  "qrCode": "data:image/png;base64,iVBORw0KG..."
}
```

#### GET /api/certifications/verify/:batchId
Verify certification by batch ID.

**Response: 200 OK**
```json
{
  "valid": true,
  "certification": {
    "batchId": "AURA-1702291200-a1b2c3d4",
    "farmer": {
      "name": "John Farmer",
      "location": { ... }
    },
    "cropType": "maize",
    "quantity": 1000,
    "averageRiskScore": 3.5,
    "status": "CERTIFIED",
    "certificationDate": "2025-12-11T10:30:00Z"
  },
  "verificationTime": "2025-12-11T11:00:00Z"
}
```

#### GET /api/certifications/farmer/:farmerId
Get all certifications for farmer.

**Response: 200 OK**
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "batchId": "AURA-1702291200-a1b2c3d4",
    "cropType": "maize",
    "quantity": 1000,
    "averageRiskScore": 3.5,
    "status": "CERTIFIED",
    "certificationDate": "2025-12-11T10:30:00Z"
  }
]
```

---

### Farmers

#### GET /api/farmers/:id
Get farmer profile.

**Response: 200 OK**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Farmer",
  "email": "john@example.com",
  "phone": "+911234567890",
  "location": {
    "latitude": 15.3173,
    "longitude": 75.7139,
    "address": "Village, District, State"
  },
  "crops": [
    {
      "type": "maize",
      "area": 5,
      "storageType": "silo"
    }
  ],
  "certifications": [ ... ],
  "alertPreferences": {
    "sms": true,
    "push": true,
    "email": true
  },
  "createdAt": "2025-11-01T00:00:00Z"
}
```

#### PUT /api/farmers/:id
Update farmer profile.

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+919876543210",
  "location": {
    "latitude": 15.3173,
    "longitude": 75.7139,
    "address": "New Address"
  },
  "alertPreferences": {
    "sms": true,
    "push": false,
    "email": true
  }
}
```

**Response: 200 OK**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Updated",
  ...
}
```

---

## ML Model API

Base URL: `http://localhost:5000`

### POST /api/predict
Get risk prediction from ML model.

**Request Body:**
```json
{
  "latitude": 15.3173,
  "longitude": 75.7139,
  "storage_type": "silo",
  "storage_quality": 0.7,
  "moisture_content": 12.5
}
```

**Response: 200 OK**
```json
{
  "prediction": {
    "risk_score": 6.5,
    "risk_level": "HIGH",
    "confidence": 0.85,
    "timestamp": "2025-12-11T10:30:00Z"
  },
  "recommendations": {
    "risk_level": "HIGH",
    "risk_score": 6.5,
    "actions": [
      "⚠️ HIGH RISK - Take preventive action within 24 hours",
      "Increase ventilation in storage area"
    ],
    "priority": "HIGH"
  },
  "risk_factors": {
    "temperature_risk": 1.5,
    "humidity_risk": 1.8,
    "crop_stress_risk": 1.3,
    "combined_risk_multiplier": 3.51,
    "assessment": "HIGH"
  },
  "data_sources": {
    "satellite": { ... },
    "weather": { ... },
    "storage": { ... }
  },
  "forecast": [ ... ]
}
```

---

## Error Responses

All errors return appropriate HTTP status codes:

**400 Bad Request**
```json
{
  "error": "Missing required fields"
}
```

**401 Unauthorized**
```json
{
  "error": "Invalid credentials"
}
```

**404 Not Found**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Something went wrong!",
  "message": "Detailed error message"
}
```

---

## Rate Limiting

- Rate limit: 100 requests per 15 minutes per IP
- Authenticated: 500 requests per 15 minutes per user

---

## Webhooks (Future)

Subscribe to real-time alerts via webhooks.

**POST /api/webhooks/subscribe**
```json
{
  "farmerId": "507f1f77bcf86cd799439011",
  "url": "https://your-server.com/webhook",
  "events": ["CRITICAL_ALERT", "NEW_CERTIFICATION"]
}
```

---

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Farmer","email":"test@test.com","password":"test123","phone":"+911234567890","location":{"latitude":15.3,"longitude":75.7}}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get Prediction (replace TOKEN)
curl -X POST http://localhost:3000/api/predictions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"farmerId":"FARMER_ID","latitude":15.3,"longitude":75.7}'
```
