const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');

// Register new farmer
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password, location, crops } = req.body;

        // Check if farmer exists
        let farmer = await Farmer.findOne({ email });
        if (farmer) {
            return res.status(400).json({ error: 'Farmer already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new farmer
        farmer = new Farmer({
            name,
            email,
            phone,
            password: hashedPassword,
            location,
            crops
        });

        await farmer.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: farmer._id, email: farmer.email },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Registration successful',
            token,
            farmer: {
                id: farmer._id,
                name: farmer.name,
                email: farmer.email,
                location: farmer.location
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login farmer
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find farmer
        const farmer = await Farmer.findOne({ email });
        if (!farmer) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, farmer.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: farmer._id, email: farmer.email },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            farmer: {
                id: farmer._id,
                name: farmer.name,
                email: farmer.email,
                location: farmer.location,
                crops: farmer.crops
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;
