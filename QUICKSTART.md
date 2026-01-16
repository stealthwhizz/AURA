# 🌾 Project AURA - Quick Start Guide

Get up and running in 10 minutes!

## What You Need

✅ Node.js 18+ installed  
✅ Python 3.8+ installed  
✅ Text editor (VS Code recommended)

## Setup Steps

### 1️⃣ Backend Setup (3 minutes)

```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Start server (uses in-memory data if no MongoDB)
npm run dev
```

✅ Backend running on http://localhost:3000

### 2️⃣ ML Model Setup (3 minutes)

```powershell
# Navigate to ml-model
cd ml-model

# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start ML API
python app.py
```

✅ ML API running on http://localhost:5000

### 3️⃣ Frontend Setup (2 minutes)

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Start dev server
npm run dev
```

✅ Frontend running on http://localhost:5173

---

## 🚀 How to Run This Project

### Option 1: One-Click Startup (Recommended) ⚡

**Run everything at once with a single command:**

```powershell
.\start_all.bat
```

This script will:
1. Start the blockchain node (Hardhat local network)
2. Deploy smart contracts automatically
3. Launch the backend server
4. Start the ML prediction engine
5. Open the frontend dashboard
6. Automatically open your browser to http://localhost:5173

**✅ All services will run in separate windows - don't close them!**

---

### Option 2: Step-by-Step Startup (For Development)

**If you need to run components individually:**

#### Step 1: Start Blockchain (Optional - only if using blockchain features)
```powershell
.\1_start_chain.bat
```
- Starts local Hardhat blockchain node
- Keep this window open - closing it resets the network
- Blockchain runs on http://localhost:8545

#### Step 2: Deploy Contracts (Optional - only if using blockchain)
```powershell
.\2_deploy_contracts.bat
```
- Deploys AURA certification contracts
- Run this AFTER the blockchain node is running
- Only needs to be done once per blockchain session

#### Step 3: Start All Application Services
```powershell
.\3_start_app.bat
```
- Starts backend (port 3000)
- Starts ML API (port 5000)  
- Starts frontend (port 5173)
- Opens browser automatically

---

### Option 3: Manual Startup (Full Control)

**Open 3 separate terminals and run:**

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - ML Model:**
```powershell
cd ml-model
venv\Scripts\activate
python app.py
```

**Terminal 3 - Frontend:**
```powershell
cd frontend
npm run dev
```

Then open browser: http://localhost:5173

---

### 🛑 Stopping the System

**Quick Stop:**
```powershell
.\kill_all.bat
```
Kills all Node.js and Python processes (stops all AURA services)

**Manual Stop:**
- Press `Ctrl+C` in each terminal window
- Close the terminal windows

---

### 4️⃣ Test the System (2 minutes)

1. Open browser: **http://localhost:5173**
2. Click **"Register"**
3. Fill in details:
   - Name: Your Name
   - Email: test@example.com
   - Password: test123
   - Latitude: **15.3173**
   - Longitude: **75.7139**
   - Crop: Maize
4. Click **Register**
5. See your dashboard with risk prediction! 🎉

## What You'll See

### Dashboard Features
- **Risk Score**: Real-time aflatoxin contamination risk (1-10 scale)
- **Risk Level**: LOW, MODERATE, HIGH, or CRITICAL
- **Recommendations**: Specific actions to take
- **Weather Data**: Current conditions affecting risk
- **Alerts**: Notifications when risk crosses thresholds

## Quick Demo Commands

### Test ML Model Directly
```powershell
cd ml-model
python predictor.py
```

### Test Backend Health
```powershell
curl http://localhost:3000/health
```

### View API Documentation
Open `API_DOCS.md` in your editor

## Common Issues & Fixes

### Port Already in Use
```powershell
# Backend (port 3000)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# ML API (port 5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Frontend (port 5173)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Python Virtual Environment Issues
```powershell
# If activation fails, try:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Dependencies Not Installing
```powershell
# Clear npm cache
npm cache clean --force

# Clear pip cache
pip cache purge
```

## Next Steps

### Add Real Data
1. Get **Sentinel Hub API** key: https://www.sentinel-hub.com/
2. Get **OpenWeatherMap API** key: https://openweathermap.org/api
3. Add keys to `ml-model/.env`

### Set Up Database
1. Install **MongoDB Community**: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Update `backend/.env`: `MONGODB_URI=mongodb://localhost:27017/aura`

### Deploy to Production
See `SETUP.md` for detailed deployment instructions

## Project Structure

```
project-aura/
├── backend/          # Node.js API (Express + MongoDB)
├── frontend/         # React PWA (Vite + React Router)
├── ml-model/         # Python ML (TensorFlow + Flask)
├── blockchain/       # Smart Contracts (Solidity + Hardhat)
├── README.md         # Project overview
├── SETUP.md          # Detailed setup guide
├── API_DOCS.md       # API reference
└── QUICKSTART.md     # This file!
```

## Key Features Built

✅ **ML Prediction Engine**
- LSTM neural network for risk assessment
- Multi-stream data fusion (satellite + weather + storage)
- Real-time risk scoring (1-10 scale)

✅ **Backend API**
- User authentication (JWT)
- Risk prediction endpoints
- Alert management system
- Certification generation

✅ **Frontend PWA**
- Responsive dashboard
- Real-time risk visualization
- Mobile-friendly interface
- Offline-capable (PWA)

✅ **Blockchain Integration**
- Ethereum smart contracts
- AURA certification on-chain
- QR code verification
- Immutable record keeping

## Development Tips

### Hot Reload Enabled
All three services support hot reload:
- **Backend**: Uses nodemon
- **ML API**: Flask debug mode
- **Frontend**: Vite HMR

### Debugging
```powershell
# Backend logs
npm run dev

# ML API logs
python app.py

# Frontend console
F12 in browser
```

### Making Changes
1. Edit files in your IDE
2. Save - changes auto-reload
3. Refresh browser (frontend only)

## Sample API Calls

### Register User
```powershell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"test123\",\"phone\":\"+911234567890\",\"location\":{\"latitude\":15.3,\"longitude\":75.7}}'
```

### Get Prediction
```powershell
curl -X POST http://localhost:5000/api/predict `
  -H "Content-Type: application/json" `
  -d '{\"latitude\":15.3173,\"longitude\":75.7139,\"storage_type\":\"bag\",\"storage_quality\":0.5,\"moisture_content\":12.0}'
```

## Resources

📖 **Documentation**
- Full Setup Guide: `SETUP.md`
- API Reference: `API_DOCS.md`
- Project Overview: `README.md`

🔗 **External APIs**
- Sentinel Hub: https://www.sentinel-hub.com/
- OpenWeatherMap: https://openweathermap.org/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas

🛠️ **Tech Stack**
- Backend: Node.js, Express, MongoDB, JWT
- Frontend: React, Vite, React Router
- ML: Python, TensorFlow, Flask, NumPy
- Blockchain: Solidity, Hardhat, Ethers.js

## Success Checklist

- [x] Backend running on port 3000
- [x] ML API running on port 5000
- [x] Frontend running on port 5173
- [x] Can register new user
- [x] Dashboard shows risk prediction
- [x] Risk score displays correctly
- [x] Recommendations appear

## Need Help?

1. Check `SETUP.md` for detailed instructions
2. Review `API_DOCS.md` for API reference
3. Look at code comments in source files
4. Check console/terminal for error messages

## What's Next?

### Phase 1: Core Features ✅
- [x] ML prediction engine
- [x] Backend API
- [x] Frontend dashboard
- [x] Database models
- [x] Blockchain contracts

### Phase 2: Enhancements
- [ ] Real-time alerts (SMS/Push)
- [ ] Historical data visualization
- [ ] Map-based risk visualization
- [ ] Multi-language support
- [ ] Mobile apps (iOS/Android)

### Phase 3: Scale
- [ ] Production deployment
- [ ] Load testing
- [ ] Performance optimization
- [ ] User onboarding
- [ ] Analytics dashboard

---

**🎉 Congratulations! Your AURA system is running!**

Now explore the dashboard, check predictions, and see how the system works together to predict and prevent aflatoxin contamination! 🌾✨
