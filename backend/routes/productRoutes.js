import express from 'express';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all products or filter by category
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, featured } = req.query;
        let query = {};
        if (category) query.category = category;
        if (featured === 'true') query.isFeatured = true;

        const products = await Product.find(query).populate('category', 'name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:idOrSlug
// @access  Public
router.get('/:idOrSlug', async (req, res) => {
    try {
        let product;
        if (req.params.idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(req.params.idOrSlug).populate('category', 'name');
        } else {
            product = await Product.findOne({ slug: req.params.idOrSlug }).populate('category', 'name');
        }

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
    try {
        console.log("Creating new product with data:", req.body);
        const product = new Product(req.body);
        const createdProduct = await product.save();
        console.log("Product created successfully:", createdProduct._id);
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Product creation error:", error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @route   PUT /api/products/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            Object.assign(product, req.body);
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @route   DELETE /api/products/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (product) {
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
