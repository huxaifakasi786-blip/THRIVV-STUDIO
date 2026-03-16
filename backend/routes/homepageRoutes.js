import express from 'express';
import Homepage from '../models/Homepage.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get homepage settings
// @route   GET /api/homepage
// @access  Public
router.get('/', async (req, res) => {
    try {
        let homepage = await Homepage.findOne().populate('sections.items').populate('sections.categories');
        if (!homepage) {
            // Create default if not exists
            homepage = await Homepage.create({});
        }
        res.json(homepage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update homepage settings
// @route   PUT /api/homepage
// @access  Private/Admin
router.put('/', protect, async (req, res) => {
    try {
        const homepage = await Homepage.findOneAndUpdate(
            {}, 
            req.body, 
            { new: true, upsert: true, runValidators: true }
        );
        res.json(homepage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
