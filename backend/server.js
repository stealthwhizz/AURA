const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// Middleware
// Middleware
app.use(cors({
    origin: '*', // Allow all origins for dev simplicity (fixes 8080/5173 mismatch)
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
    try {
        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('MongoDB connected successfully');
        } else {
            console.log('MongoDB URI not configured - running without database');
        }
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

connectDB();

// Import routes
const authRoutes = require('./routes/auth');
const farmerRoutes = require('./routes/farmers');
const predictionRoutes = require('./routes/predictions');
const alertRoutes = require('./routes/alerts');
const certificationRoutes = require('./routes/certifications');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/certifications', certificationRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'AURA Backend API',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`AURA Backend Server running on port ${PORT}`);
    console.log('Available endpoints:');
    console.log('  POST /api/auth/register - Register new user');
    console.log('  POST /api/auth/login - Login user');
    console.log('  GET  /api/farmers/:id - Get farmer profile');
    console.log('  POST /api/predictions - Get risk prediction');
    console.log('  GET  /api/alerts/:farmerId - Get alerts');
    console.log('  POST /api/certifications - Generate certification');
});

module.exports = app;
