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

        if (!farmerId || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ error: 'Missing required fields: farmerId, latitude, longitude' });
        }

        let predictionData;
        let prediction;

        // Try to call ML API first
        try {
            const mlApiUrl = process.env.ML_API_URL || 'http://localhost:5000';
            const mlResponse = await axios.post(`${mlApiUrl}/api/predict`, {
                latitude,
                longitude,
                storage_type: storageType || 'bag',
                storage_quality: storageQuality || 0.5,
                moisture_content: moistureContent || 12.0
            }, { timeout: 5000 });

            predictionData = mlResponse.data;

            // Save prediction to database
            prediction = new Prediction({
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
                })),
                storageType,
                storageQuality,
                moistureContent
            });

        } catch (mlError) {
            console.warn('ML API unavailable, using basic risk calculation:', mlError.message);

            // Fallback: Basic risk calculation
            const moistureRisk = moistureContent > 14 ? (moistureContent - 14) * 10 : 0;
            const storageQualityRisk = storageQuality === 'Poor' ? 30 : storageQuality === 'Fair' ? 20 : storageQuality === 'Good' ? 10 : 0;
            const baseRisk = 15;
            const riskScore = Math.min(100, baseRisk + moistureRisk + storageQualityRisk);

            let riskLevel = 'low';
            if (riskScore >= 70) riskLevel = 'critical';
            else if (riskScore >= 50) riskLevel = 'high';
            else if (riskScore >= 30) riskLevel = 'moderate';

            const recommendations = [];
            if (moistureContent > 14) recommendations.push('Reduce moisture content to below 14%');
            if (storageQuality === 'Poor' || storageQuality === 'Fair') recommendations.push('Improve storage conditions');
            recommendations.push('Monitor storage regularly for signs of contamination');

            prediction = new Prediction({
                farmer: farmerId,
                location: { latitude, longitude },
                riskScore,
                riskLevel,
                confidence: 70,
                recommendations: recommendations.map(r => ({ priority: riskLevel, action: r })),
                storageType,
                storageQuality,
                moistureContent
            });

            predictionData = {
                prediction: { risk_score: riskScore, risk_level: riskLevel, confidence: 70 },
                recommendations: {
                    priority: riskLevel,
                    actions: recommendations
                },
                forecast: {
                    nextWeek: riskScore,
                    trend: 'stable'
                }
            };
        }

        await prediction.save();

        // Check if alert should be triggered
        if (prediction.riskScore >= 60) {
            await createAlert(farmerId, prediction, predictionData);
        }

        res.json({
            prediction,
            recommendations: predictionData.recommendations.actions || predictionData.recommendations,
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
