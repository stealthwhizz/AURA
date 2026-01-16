const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');

// Bootstrap Super Admin
const ensureSuperAdmin = async () => {
    try {
        const adminEmail = process.env.ROOT_ADMIN_EMAIL;
        const adminPassword = process.env.ROOT_ADMIN_PASSWORD || 'admin123'; // Fallback for dev

        if (!adminEmail) return; // Skip if not configured

        const adminExists = await Farmer.findOne({ email: adminEmail });
        if (!adminExists) {
            console.log('Creating Super Admin account...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            const admin = new Farmer({
                name: 'Super Admin',
                email: adminEmail,
                phone: '0000000000',
                password: hashedPassword,
                role: 'admin',
                location: { latitude: 0, longitude: 0 }, // Dummy location
                crops: []
            });

            await admin.save();
            console.log(`Super Admin created: ${adminEmail}`);
        }
    } catch (error) {
        console.error('Error creating super admin:', error);
    }
};

// Run check on startup (technically runs when this file is imported, better in server.js but this works for now if imported)
ensureSuperAdmin();


// Register new farmer (Default role: farmer)
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password, location, crops } = req.body;

        // Check if farmer exists
        let farmer = await Farmer.findOne({ email });
        if (farmer) {
            return res.status(400).json({ error: 'User already registered' });
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
            crops,
            role: 'farmer' // Force default role
        });

        await farmer.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: farmer._id, email: farmer.email, role: farmer.role },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Registration successful',
            token,
            farmer: {
                _id: farmer._id,
                name: farmer.name,
                email: farmer.email,
                phone: farmer.phone,
                role: farmer.role,
                location: farmer.location,
                crops: farmer.crops
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

const { auth, isAdmin } = require('../middleware/auth');

// Admin Invite (Create another admin/certifier) - Protected Route
router.post('/invite', auth, isAdmin, async (req, res) => {
    // This endpoint is protected by isAdmin middleware
    // For now, minimal implementation
    try {
        const { name, email, password, role } = req.body;
        // Simplified check, rely on middleware in real impl

        let user = await Farmer.findOne({ email });
        if (user) return res.status(400).json({ error: 'User exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new Farmer({
            name,
            email,
            phone: '0000000000',
            password: hashedPassword,
            role: role || 'admin',
            location: { latitude: 0, longitude: 0 },
            crops: []
        });

        await user.save();
        res.status(201).json({ message: `User created with role ${role}` });

    } catch (error) {
        res.status(500).json({ error: error.message });
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
            { id: farmer._id, email: farmer.email, role: farmer.role },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            farmer: {
                _id: farmer._id,
                name: farmer.name,
                email: farmer.email,
                phone: farmer.phone,
                role: farmer.role,
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
