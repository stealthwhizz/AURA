# Project AURA 🌾
## Aflatoxin Universal Risk Assessment

*Predictive Public Health System for Agriculture*
[![Status](https://img.shields.io/badge/Status-In%20Development-orange.svg)]()

---

## 🚨 The Problem

**The Invisible Toxin Crisis**

Aflatoxins are potent carcinogens produced by fungus that grows on staple crops like maize, groundnuts, rice, and chilies during post-harvest storage. This creates a massive, under-reported health and economic crisis:

- **Public Health Crisis**: Aflatoxins cause liver cancer and childhood stunting
- **Economic Catastrophe**: Single contaminated shipments worth millions get rejected from international markets
- **Data Problem**: Contamination is invisible and happens silently in storage

### 📊 Market Impact
- 18% of Indian food samples exceed safety limits
- Karnataka shows 70.5% contamination rates in groundnuts
- Global mycotoxin testing market: $1.6B (2024) → $2.3B (2029)
- Each contaminated export shipment costs millions in losses

---

## 💡 The Solution

**AURA is NOT another traceability app.** We are building a **predictive public health system** that forecasts mycotoxin contamination **before it happens**, giving farmers a critical intervention window.

### 🏗️ Technical Architecture

#### 1. **Predictive Core (AI/ML)**
- **Multi-Stream Data Fusion Model**:
  - 🛰️ **Geospatial Data**: Sentinel-2 satellite imagery analyzing crop stress
  - 🌡️ **Weather Data**: Real-time humidity, temperature, rainfall patterns
  - 🏪 **Storage Data**: Simulated models for different storage types
- **ML Implementation**:
  - Time-series LSTM model processing fused data streams
  - Real-time **Aflatoxin Risk Score (ARS)** from 1-10
  - Hyperlocal forecasting with 48-72 hour prediction window

#### 2. **Proactive Alert System (PWA)**
- Smart notifications when ARS crosses critical thresholds
- Actionable recommendations, not just warnings
- Example: *"CRITICAL ALERT: Humidity spike expected in 48 hours. Aflatoxin Risk: 9/10. ACTION: Immediately deploy drying beads and ensure silo ventilation."*

#### 3. **AURA-Certified Ledger (Blockchain)**
- Harvests managed using AURA guidance get blockchain certification
- QR codes for verified low-risk batches
- Creates premium market for AURA-certified safe produce
- Buyers can verify safety scores and preventive actions taken

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Data Sources** | Sentinel-2 (Copernicus), Weather APIs |
| **ML Framework** | TensorFlow/PyTorch for LSTM |
| **Frontend** | Progressive Web App (PWA) |
| **Blockchain** | Ethereum testnet |
| **Backend** | Node.js/Python data processing pipeline |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- Access to Sentinel-2 API
- Weather API credentials

### Installation
```bash
# Clone the repository
git clone https://github.com/stealthwhizz/aura.git
cd aura

# Install dependencies
npm install
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Add your API keys and configuration
```

### Usage
```bash
# Start the development server
npm run dev

# Run the ML prediction model
python src/ml/predict_aflatoxin.py

# Deploy alerts system
npm run start:alerts
```

---

## 📈 Expected Impact

### Immediate Benefits (6-Month Horizon)
- ✅ 15-25% reduction in aflatoxin contamination for participating farmers
- 💰 10-15% premium pricing for AURA-certified produce  
- 👥 Early adoption by 500-1000 farmers in pilot region

### Long-term Impact (2-3 Years)
- 🏥 Prevent 10,000+ cases of aflatoxin-related health issues
- 💵 Enable $50M+ in previously rejected export revenues
- 🌾 Scale to 100,000+ farmers across major agricultural states
- 📋 Establish new food safety standards for Indian agriculture

### Social Impact
- **Health**: Reduced childhood stunting and liver cancer rates
- **Economic**: Increased farmer incomes through export market access  
- **Food Security**: Safer domestic food supply chain

---

## 💼 Business Model

### Revenue Streams
1. **Premium Certification**: Farmers pay for AURA risk assessment
2. **Buyer Subscriptions**: Food companies pay for verified supply access
3. **Data Licensing**: Aggregated risk intelligence to agribusiness
4. **Insurance Partnerships**: Risk scores enable parametric crop insurance

### Competitive Advantages
- 🥇 **First-mover**: No existing predictive aflatoxin solutions
- 🔗 **Data Fusion**: Novel combination of satellite, weather, and storage data
- ⚡ **Actionable Intelligence**: Proactive alerts vs reactive testing
- 💎 **Economic Incentives**: Blockchain certification creates market premiums

---

## 📊 Success Metrics

### Technical KPIs
- Risk prediction accuracy: >75% for 48-hour forecasts
- Alert response time: <30 minutes from threshold breach
- System uptime: >99.5% availability

### Business KPIs  
- Farmer adoption rate: 20% month-over-month growth
- Contamination reduction: 20%+ for AURA users vs control group
- Revenue per farmer: $50-100 annually

### Impact KPIs
- Health outcomes: Measurable reduction in aflatoxin exposure
- Export success: 30%+ increase in successful shipments
- Economic value: $1000+ per farmer annual benefit

---

## 🔧 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🏆 Team

**Project Team**: AURA FARMER8
**Institution**: PES University  
**Competition**: Vodafone Hackathon  
**Date**: August 24, 2025

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Support

If you found this project helpful, please ⭐ star the repository!

For questions and support:
- 📧 Email: [ash56pokemon@gmail.com]

---

*Together, let's build a safer agricultural future! 🌱*
