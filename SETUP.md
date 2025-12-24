# Project AURA - Setup & Deployment Guide

Complete guide to set up and run Project AURA locally and in production.

## Prerequisites

- **Node.js** v18+ and npm
- **Python** 3.8+
- **MongoDB** (local or MongoDB Atlas)
- **Git**

## Project Structure

```
project-aura/
├── backend/          # Node.js API server
├── frontend/         # React PWA
├── ml-model/         # Python ML prediction engine
├── blockchain/       # Ethereum smart contracts
└── README.md
```

## Quick Start (Development)

### 1. Clone & Setup

```bash
cd project-aura
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env and configure:
# - MongoDB connection string
# - JWT secret
# - API keys

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3000`

### 3. ML Model Setup

```bash
cd ml-model

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
copy .env.example .env

# Edit .env and add API keys:
# - Sentinel Hub API key
# - Weather API key

# Start ML API server
python app.py
```

ML API will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env:
VITE_API_URL=http://localhost:3000

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 5. Blockchain Setup (Optional)

```bash
cd blockchain

# Install dependencies
npm install

# Start local Hardhat node (in separate terminal)
npx hardhat node

# Deploy contracts
npm run deploy

# Copy contract address to backend .env
```

## Database Setup

### MongoDB Local

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Connection string: `mongodb://localhost:27017/aura`

### MongoDB Atlas (Cloud)

1. Create free cluster at mongodb.com/cloud/atlas
2. Get connection string
3. Add to backend `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aura
```

## API Keys Required

### 1. Sentinel Hub (Satellite Data)
- Sign up: https://www.sentinel-hub.com/
- Free tier available
- Add to `ml-model/.env`: `SENTINEL_API_KEY=your_key`

### 2. OpenWeatherMap (Weather Data)
- Sign up: https://openweathermap.org/api
- Free tier: 1000 calls/day
- Add to `ml-model/.env`: `WEATHER_API_KEY=your_key`

### 3. Twilio (SMS Alerts - Optional)
- Sign up: https://www.twilio.com/
- Add to `backend/.env`:
```
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_number
```

## Testing the System

### 1. Test ML Model

```bash
cd ml-model
python predictor.py
```

Should output sample risk prediction.

### 2. Test Backend API

```bash
# Health check
curl http://localhost:3000/health
```

### 3. Register a Test User

Open `http://localhost:5173` in browser and:
1. Click "Register"
2. Fill in farmer details
3. Use test coordinates: Lat: 15.3173, Lon: 75.7139

### 4. Get Risk Prediction

After login, dashboard will automatically fetch risk prediction.

## Production Deployment

### Backend (Node.js)

**Option 1: Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Option 2: Heroku**
```bash
# Install Heroku CLI
npm install -g heroku

# Deploy
heroku create aura-backend
git push heroku main
```

### Frontend (React PWA)

**Option 1: Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

cd frontend
vercel
```

**Option 2: Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

cd frontend
npm run build
netlify deploy --prod
```

### ML Model (Python)

**Option 1: Google Cloud Run**
```bash
# Build Docker image
docker build -t aura-ml .

# Deploy to Cloud Run
gcloud run deploy aura-ml --source .
```

**Option 2: AWS Lambda**
- Use Serverless Framework
- Package Python app
- Deploy to Lambda with API Gateway

### Database (MongoDB)

**Production:** MongoDB Atlas (recommended)
- Free tier: 512MB storage
- Automatic backups
- Global clusters

## Environment Variables (Production)

### Backend
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=strong_random_secret_key
ML_API_URL=https://your-ml-api.com
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/your_key
```

### Frontend
```
VITE_API_URL=https://your-backend-api.com
```

### ML Model
```
FLASK_ENV=production
SENTINEL_API_KEY=your_key
WEATHER_API_KEY=your_key
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS/SSL certificates
- [ ] Set CORS to specific domains (not *)
- [ ] Rate limit API endpoints
- [ ] Validate all user inputs
- [ ] Never commit `.env` files
- [ ] Use environment-specific configs
- [ ] Enable MongoDB authentication
- [ ] Secure blockchain private keys

## Monitoring & Logs

### Backend Logs
```bash
# View logs (Railway)
railway logs

# View logs (Heroku)
heroku logs --tail
```

### Error Tracking
- Integrate Sentry for error monitoring
- Set up health check endpoints
- Monitor API response times

## Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify all environment variables
- Check port availability (3000)

### ML API errors
- Verify Python dependencies installed
- Check API keys are valid
- Ensure Flask port (5000) is available

### Frontend can't connect
- Check VITE_API_URL matches backend
- Verify CORS is configured
- Check browser console for errors

### Database connection fails
- Verify MongoDB is running
- Check connection string format
- Ensure IP is whitelisted (Atlas)

## Performance Optimization

### Backend
- Enable caching (Redis)
- Use connection pooling
- Compress responses (gzip)
- Implement rate limiting

### Frontend
- Enable code splitting
- Lazy load routes
- Optimize images
- Use service worker caching

### ML Model
- Cache frequent predictions
- Batch API requests
- Use model quantization
- Deploy on GPU instances for production

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (nginx/AWS ALB)
- Deploy multiple backend instances
- Use Redis for session management
- Implement message queue (RabbitMQ/Kafka)

### Database Scaling
- Enable MongoDB replica sets
- Use read replicas
- Implement sharding for large datasets
- Add database indexing

## Support & Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor API usage/costs
- Review error logs weekly
- Backup database daily
- Test disaster recovery

### Updates
```bash
# Update backend
cd backend
npm update

# Update frontend
cd frontend
npm update

# Update ML model
cd ml-model
pip install --upgrade -r requirements.txt
```

## Cost Estimates

### Free Tier (Suitable for POC)
- MongoDB Atlas: Free (512MB)
- Vercel: Free (hobby)
- Railway: $5/month
- Weather API: Free (1000 calls/day)
- Total: ~$5/month

### Production (100 farmers)
- MongoDB Atlas: $9/month (2GB)
- Backend hosting: $15/month
- ML API hosting: $20/month
- API costs: $20/month
- Total: ~$64/month

## License

MIT License - See LICENSE file

## Support

For issues and questions:
- GitHub Issues: [Create issue]
- Email: support@aura-project.com
- Documentation: [Link to docs]
