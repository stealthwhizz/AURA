const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    batchId: {
        type: String,
        required: true,
        unique: true
    },
    cropType: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true // in kg or tons
    },
    harvestDate: {
        type: Date,
        required: true
    },
    certificationDate: {
        type: Date,
        default: Date.now
    },
    averageRiskScore: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    predictions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prediction'
    }],
    interventionsTaken: [{
        date: Date,
        action: String,
        effectiveness: String
    }],
    blockchainTxHash: {
        type: String,
        default: null
    },
    qrCode: {
        type: String, // Base64 encoded QR code image
        default: null
    },
    status: {
        type: String,
        enum: ['PENDING', 'CERTIFIED', 'REJECTED'],
        default: 'PENDING'
    },
    verificationUrl: {
        type: String
    },
    metadata: {
        storageConditions: String,
        preventiveActions: [String],
        testResults: String
    },
    expiresAt: {
        type: Date,
        default: () => new Date(+new Date() + 365*24*60*60*1000) // 1 year
    }
});

// Index for batch lookup
CertificationSchema.index({ batchId: 1 });
CertificationSchema.index({ farmer: 1, certificationDate: -1 });

module.exports = mongoose.model('Certification', CertificationSchema);
