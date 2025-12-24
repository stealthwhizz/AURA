const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    location: {
        latitude: Number,
        longitude: Number
    },
    riskScore: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    riskLevel: {
        type: String,
        enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
        required: true
    },
    confidence: {
        type: Number,
        min: 0,
        max: 1
    },
    factors: {
        temperatureRisk: Number,
        humidityRisk: Number,
        cropStressRisk: Number,
        storageQualityRisk: Number
    },
    satelliteData: {
        ndvi: Number,
        ndmi: Number,
        cropHealth: Number,
        stressLevel: Number
    },
    weatherData: {
        temperature: Number,
        humidity: Number,
        rainfall: Number,
        windSpeed: Number
    },
    storageData: {
        type: String,
        ventilationScore: Number,
        moistureContent: Number
    },
    recommendations: [{
        priority: String,
        action: String
    }],
    predictionDate: {
        type: Date,
        default: Date.now
    },
    validUntil: {
        type: Date,
        default: () => new Date(+new Date() + 72*60*60*1000) // 72 hours
    }
});

// Index for querying recent predictions
PredictionSchema.index({ farmer: 1, predictionDate: -1 });

module.exports = mongoose.model('Prediction', PredictionSchema);
