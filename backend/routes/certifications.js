const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const Certification = require('../models/Certification');
const Prediction = require('../models/Prediction');
const Farmer = require('../models/Farmer');
const { writeToBlockchain } = require('../utils/blockchain');
const { mapCertificationToFrontend } = require('../utils/mappers');


// Generate AURA certification
router.post('/', async (req, res) => {
    try {
        console.log('Received Certification Request:', req.body);
        const { farmerId, cropType, quantity, harvestDate, predictions, interventions } = req.body;

        if (!farmerId) return res.status(400).json({ error: 'Missing farmerId' });
        if (!cropType) return res.status(400).json({ error: 'Missing cropType' });
        if (!quantity) return res.status(400).json({ error: 'Missing quantity', received: quantity });

        // Calculate average risk score from predictions
        let avgRiskScore = 5; // Default low-moderate risk score
        if (predictions && predictions.length > 0) {
            const predictionDocs = await Prediction.find({
                _id: { $in: predictions }
            });

            if (predictionDocs.length > 0) {
                avgRiskScore = predictionDocs.reduce((sum, p) => sum + p.riskScore, 0) / predictionDocs.length;
            }
        }

        // Note: Removed blocking validation - certifications can be created at any risk level
        // Risk score will be displayed to buyers who can make informed decisions

        // Format interventions for schema
        let interventionsTaken = [];
        if (interventions) {
            interventionsTaken.push({
                action: typeof interventions === 'string' ? interventions : JSON.stringify(interventions),
                date: new Date(),
                effectiveness: 'Reported'
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
            interventionsTaken,
            // Set all new certifications as CERTIFIED
            // Admins can manually revoke if needed
            status: 'CERTIFIED'
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

        // Write to blockchain
        let blockchainStatus = 'pending';
        try {
            const txHash = await writeToBlockchain(certification);
            if (txHash) {
                certification.blockchainTxHash = txHash;
                blockchainStatus = 'confirmed';
                console.log(`✓ Blockchain transaction confirmed: ${txHash}`);
            } else {
                blockchainStatus = 'failed';
                console.warn('Blockchain write returned null - contract may not be deployed');
            }
            await certification.save();
        } catch (bcError) {
            blockchainStatus = 'failed';
            console.error("Blockchain sync failed:", bcError.message);
        }

        res.status(201).json({
            message: 'Certification generated successfully',
            certification: mapCertificationToFrontend(certification),
            qrCode: qrCodeData,
            blockchainStatus
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

        res.json(mapCertificationToFrontend(certification));

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

        res.json(certifications.map(mapCertificationToFrontend));

    } catch (error) {
        console.error('Certifications fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch certifications' });
    }
});

module.exports = router;
