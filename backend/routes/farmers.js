const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer');

// Get farmer profile
router.get('/:id', async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.params.id)
            .select('-password')
            .populate('certifications');

        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }

        res.json(farmer);

    } catch (error) {
        console.error('Farmer fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch farmer profile' });
    }
});

// Update farmer profile
router.put('/:id', async (req, res) => {
    try {
        const { name, phone, location, crops, alertPreferences } = req.body;

        const farmer = await Farmer.findByIdAndUpdate(
            req.params.id,
            { name, phone, location, crops, alertPreferences },
            { new: true, runValidators: true }
        ).select('-password');

        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }

        res.json(farmer);

    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

module.exports = router;
