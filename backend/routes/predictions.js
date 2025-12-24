const express = require('express');
const router = express.Router();
const axios = require('axios');
const Prediction = require('../models/Prediction');
const Alert = require('../models/Alert');
const Farmer = require('../models/Farmer');

// Get risk prediction
router.post('/', async (req, res) => {
    try {
        const { farmerId, latitude, longitude, storageType, storageQuality, moistureContent } = req.body;

        if (!farmerId || !latitude || !longitude) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Call ML API
        const mlApiUrl = process.env.ML_API_URL || 'http://localhost:5000';
        const mlResponse = await axios.post(`${mlApiUrl}/api/predict`, {
            latitude,
            longitude,
            storage_type: storageType || 'bag',
            storage_quality: storageQuality || 0.5,
            moisture_content: moistureContent || 12.0
        });

        const predictionData = mlResponse.data;

        // Save prediction to database
        const prediction = new Prediction({
            farmer: farmerId,
            location: { latitude, longitude },
            riskScore: predictionData.prediction.risk_score,
            riskLevel: predictionData.prediction.risk_level,
            confidence: predictionData.prediction.confidence,
            factors: {
                temperatureRisk: predictionData.risk_factors.temperature_risk,
                humidityRisk: predictionData.risk_factors.humidity_risk,
                cropStressRisk: predictionData.risk_factors.crop_stress_risk
            },
            satelliteData: predictionData.data_sources.satellite,
            weatherData: predictionData.data_sources.weather,
            storageData: predictionData.data_sources.storage,
            recommendations: predictionData.recommendations.actions.map(action => ({
                priority: predictionData.recommendations.priority,
                action
            }))
        });

        await prediction.save();

        // Check if alert should be triggered
        if (predictionData.prediction.risk_score >= 6) {
            await createAlert(farmerId, prediction, predictionData);
        }

        res.json({
            prediction,
            recommendations: predictionData.recommendations,
            forecast: predictionData.forecast
        });

    } catch (error) {
        console.error('Prediction error:', error);
        res.status(500).json({ 
            error: 'Prediction failed',
            message: error.message
        });
    }
});

// Get prediction history for farmer
router.get('/history/:farmerId', async (req, res) => {
    try {
        const { farmerId } = req.params;
        const limit = parseInt(req.query.limit) || 20;

        const predictions = await Prediction.find({ farmer: farmerId })
            .sort({ predictionDate: -1 })
            .limit(limit);

        res.json(predictions);

    } catch (error) {
        console.error('History fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Helper function to create alert
async function createAlert(farmerId, prediction, predictionData) {
    const severity = predictionData.prediction.risk_level;
    
    let title, message;
    if (severity === 'CRITICAL') {
        title = '🚨 CRITICAL AFLATOXIN RISK';
        message = `Immediate action required! Risk Score: ${predictionData.prediction.risk_score.toFixed(1)}/10`;
    } else if (severity === 'HIGH') {
        title = '⚠️ HIGH AFLATOXIN RISK';
        message = `Take preventive action within 24 hours. Risk Score: ${predictionData.prediction.risk_score.toFixed(1)}/10`;
    } else {
        title = '⚡ MODERATE AFLATOXIN RISK';
        message = `Monitor closely and prepare. Risk Score: ${predictionData.prediction.risk_score.toFixed(1)}/10`;
    }

    const alert = new Alert({
        farmer: farmerId,
        prediction: prediction._id,
        type: 'RISK_THRESHOLD',
        severity,
        title,
        message,
        actions: predictionData.recommendations.actions
    });

    await alert.save();
    
    // TODO: Trigger actual notifications (SMS, push, email)
    
    return alert;
}

module.exports = router;
