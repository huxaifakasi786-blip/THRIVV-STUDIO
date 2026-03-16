import express from 'express';
import Settings from '../models/Settings.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc Get site settings
// @route GET /api/settings
// @access Public
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
router.put('/', protect, async (req, res) => {
    try {
        console.log("Updating settings with data:", req.body);
        const settings = await Settings.findOneAndUpdate(
            {}, 
            { ...req.body }, 
            { new: true, upsert: true, runValidators: true }
        );
        console.log("Settings updated successfully");
        res.json(settings);
    } catch (error) {
        console.error("Settings update error:", error);
        res.status(400).json({ message: error.message });
    }
});

export default router;
