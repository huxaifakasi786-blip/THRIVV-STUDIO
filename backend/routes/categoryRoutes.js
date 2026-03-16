import express from 'express';
import Category from '../models/Category.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a category (Admin only)
// @route   POST /api/categories
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
    try {
        console.log("Creating new category with data:", req.body);
        const { name, slug, image, description } = req.body;
        const category = new Category({ name, slug, image, description });
        const createdCategory = await category.save();
        console.log("Category created successfully:", createdCategory._id);
        res.status(201).json(createdCategory);
    } catch (error) {
        console.error("Category creation error:", error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @route   PUT /api/categories/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (category) {
            category.name = req.body.name || category.name;
            category.slug = req.body.slug || category.slug;
            category.image = req.body.image || category.image;
            category.description = req.body.description || category.description;

            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @route   DELETE /api/categories/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (category) {
            res.json({ message: 'Category removed' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
