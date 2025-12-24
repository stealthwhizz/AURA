const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        address: String,
        district: String,
        state: String
    },
    crops: [{
        type: {
            type: String,
            enum: ['maize', 'groundnut', 'rice', 'chili', 'wheat', 'other']
        },
        area: Number, // in acres
        storageType: {
            type: String,
            enum: ['silo', 'bag', 'warehouse', 'open']
        },
        harvestDate: Date
    }],
    certifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certification'
    }],
    alertPreferences: {
        sms: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: true }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Farmer', FarmerSchema);
