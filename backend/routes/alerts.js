const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// Get alerts for farmer
router.get('/:farmerId', async (req, res) => {
    try {
        const { farmerId } = req.params;
        const { unreadOnly } = req.query;

        let query = { farmer: farmerId };
        if (unreadOnly === 'true') {
            query.read = false;
        }

        const alerts = await Alert.find(query)
            .sort({ createdAt: -1 })
            .populate('prediction')
            .limit(50);

        res.json(alerts);

    } catch (error) {
        console.error('Alerts fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
});

// Mark alert as read
router.put('/:alertId/read', async (req, res) => {
    try {
        const { alertId } = req.params;

        const alert = await Alert.findByIdAndUpdate(
            alertId,
            { read: true },
            { new: true }
        );

        if (!alert) {
            return res.status(404).json({ error: 'Alert not found' });
        }

        res.json(alert);

    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ error: 'Failed to mark alert as read' });
    }
});

// Acknowledge alert
router.put('/:alertId/acknowledge', async (req, res) => {
    try {
        const { alertId } = req.params;

        const alert = await Alert.findByIdAndUpdate(
            alertId,
            { acknowledged: true, read: true },
            { new: true }
        );

        if (!alert) {
            return res.status(404).json({ error: 'Alert not found' });
        }

        res.json(alert);

    } catch (error) {
        console.error('Acknowledge error:', error);
        res.status(500).json({ error: 'Failed to acknowledge alert' });
    }
});

// Get alert statistics
router.get('/:farmerId/stats', async (req, res) => {
    try {
        const { farmerId } = req.params;

        const stats = await Alert.aggregate([
            { $match: { farmer: mongoose.Types.ObjectId(farmerId) } },
            {
                $group: {
                    _id: '$severity',
                    count: { $sum: 1 },
                    unread: {
                        $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] }
                    }
                }
            }
        ]);

        res.json(stats);

    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

module.exports = router;
