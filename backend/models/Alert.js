const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    prediction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prediction'
    },
    type: {
        type: String,
        enum: ['RISK_THRESHOLD', 'WEATHER_WARNING', 'ACTION_REQUIRED', 'INFO'],
        required: true
    },
    severity: {
        type: String,
        enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    actions: [{
        type: String
    }],
    sent: {
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: false },
        email: { type: Boolean, default: false }
    },
    read: {
        type: Boolean,
        default: false
    },
    acknowledged: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: () => new Date(+new Date() + 48*60*60*1000) // 48 hours
    }
});

// Index for querying farmer's recent alerts
AlertSchema.index({ farmer: 1, createdAt: -1 });
AlertSchema.index({ read: 1, acknowledged: 1 });

module.exports = mongoose.model('Alert', AlertSchema);
