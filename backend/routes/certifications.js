const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const Certification = require('../models/Certification');
const Prediction = require('../models/Prediction');
const Farmer = require('../models/Farmer');

// Generate AURA certification
router.post('/', async (req, res) => {
    try {
        const { farmerId, cropType, quantity, harvestDate, predictions, interventions } = req.body;

        if (!farmerId || !cropType || !quantity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Calculate average risk score from predictions
        const predictionDocs = await Prediction.find({
            _id: { $in: predictions }
        });

        if (predictionDocs.length === 0) {
            return res.status(400).json({ error: 'No predictions found' });
        }

        const avgRiskScore = predictionDocs.reduce((sum, p) => sum + p.riskScore, 0) / predictionDocs.length;

        // Check if eligible for certification (risk score should be low)
        if (avgRiskScore > 7) {
            return res.status(400).json({
                error: 'Risk score too high for certification',
                averageRiskScore: avgRiskScore,
                message: 'Reduce aflatoxin risk before requesting certification'
            });
        }

        // Generate unique batch ID
        const batchId = `AURA-${Date.now()}-${uuidv4().substring(0, 8)}`;

        // Create certification
        const certification = new Certification({
            farmer: farmerId,
            batchId,
            cropType,
            quantity,
            harvestDate: harvestDate || new Date(),
            averageRiskScore: avgRiskScore,
            predictions,
            interventionsTaken: interventions || [],
            status: avgRiskScore < 4 ? 'CERTIFIED' : 'PENDING'
        });

        // Generate QR code
        const verificationUrl = `https://aura.verify/${batchId}`;
        certification.verificationUrl = verificationUrl;

        const qrCodeData = await QRCode.toDataURL(verificationUrl);
        certification.qrCode = qrCodeData;

        await certification.save();

        // Update farmer's certifications
        await Farmer.findByIdAndUpdate(farmerId, {
            $push: { certifications: certification._id }
        });

        // TODO: Write to blockchain
        // const txHash = await writeToBlockchain(certification);
        // certification.blockchainTxHash = txHash;
        // await certification.save();

        res.status(201).json({
            message: 'Certification generated successfully',
            certification,
            qrCode: qrCodeData
        });

    } catch (error) {
        console.error('Certification error:', error);
        res.status(500).json({ error: 'Certification generation failed' });
    }
});

// Verify certification by batch ID
router.get('/verify/:batchId', async (req, res) => {
    try {
        const { batchId } = req.params;

        const certification = await Certification.findOne({ batchId })
            .populate('farmer', 'name location')
            .populate('predictions');

        if (!certification) {
            return res.status(404).json({ error: 'Certification not found' });
        }

        res.json({
            valid: certification.status === 'CERTIFIED',
            certification,
            verificationTime: new Date().toISOString()
        });

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// Get certifications for farmer
router.get('/farmer/:farmerId', async (req, res) => {
    try {
        const { farmerId } = req.params;

        const certifications = await Certification.find({ farmer: farmerId })
            .sort({ certificationDate: -1 })
            .limit(20);

        res.json(certifications);

    } catch (error) {
        console.error('Certifications fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch certifications' });
    }
});

module.exports = router;
