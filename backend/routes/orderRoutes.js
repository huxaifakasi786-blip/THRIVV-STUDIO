import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { customerDetail, orderItems, paymentMethod, totalAmount } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Generate unique order number (simple format: THRIVV-TIMESTAMP)
        const orderNumber = `THV-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`;

        const order = new Order({
            customerDetail,
            orderItems,
            paymentMethod,
            totalAmount,
            orderNumber
        });

        // Validate stock for all items first
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.name}` });
            }
            const variant = product.variants.find(v => v.size === item.size);
            if (!variant || variant.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name} (${item.size})` });
            }
        }

        // Now perform decrements
        for (const item of orderItems) {
            await Product.findOneAndUpdate(
                { _id: item.product, "variants.size": item.size },
                { $inc: { "variants.$.stock": -item.quantity } }
            );
        }
        
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ message: 'Failed to create order: ' + error.message });
    }
});

// @desc    Get all orders (Admin only later)
// @route   GET /api/orders
// @access  Private/Admin
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @route   PUT /api/orders/:id/status
router.put('/:id/status', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
