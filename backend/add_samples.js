import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const samples = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data (Optional: depends on if we want to reset or just add)
        // For this task, we want fresh high quality samples
        await Product.deleteMany({});
        await Category.deleteMany({});

        // Ensure Admin exists
        const adminUsername = 'admin';
        let admin = await User.findOne({ username: adminUsername });
        if (!admin) {
            admin = await User.create({
                username: adminUsername,
                password: 'admin123',
                role: 'admin'
            });
            console.log('👤 Admin user created');
        }

        // Create Categories
        const categoriesData = [
            { name: 'Hoodies', slug: 'hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600' },
            { name: 'T-Shirts', slug: 't-shirts', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600' },
            { name: 'Cargo Pants', slug: 'cargo-pants', image: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?auto=format&fit=crop&q=80&w=600' },
            { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=600' }
        ];

        const createdCategories = await Category.insertMany(categoriesData);
        console.log('📁 Categories created');

        const getCatId = (slug) => createdCategories.find(c => c.slug === slug)._id;

        // Products Data
        const productsData = [
            {
                name: 'VORTEX NEON HOODIE',
                slug: 'vortex-neon-hoodie',
                description: 'Heavyweight oversized hoodie with reactive neon graphics. Built for the cyber era.',
                price: 5500,
                category: getCatId('hoodies'),
                images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'],
                variants: [
                    { size: 'S', stock: 15 },
                    { size: 'M', stock: 25 },
                    { size: 'L', stock: 20 },
                    { size: 'XL', stock: 10 }
                ],
                isFeatured: true
            },
            {
                name: 'CYBER-PUNK OVERSIZED TEE',
                slug: 'cyber-punk-tee',
                description: '280 GSM premium cotton tee with high-density puff print graphics.',
                price: 2800,
                category: getCatId('t-shirts'),
                images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800'],
                variants: [
                    { size: 'S', stock: 20 },
                    { size: 'M', stock: 35 },
                    { size: 'L', stock: 30 }
                ],
                isFeatured: true
            },
            {
                name: 'TACTICAL CARGO V2',
                slug: 'tactical-cargo-v2',
                description: 'Multi-pocket technical cargo pants with water-repellent finish and adjustable hem.',
                price: 4200,
                category: getCatId('cargo-pants'),
                images: ['https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?auto=format&fit=crop&q=80&w=800'],
                variants: [
                    { size: '30', stock: 10 },
                    { size: '32', stock: 18 },
                    { size: '34', stock: 15 }
                ],
                isFeatured: true
            },
            {
                name: 'PHANTOM BEANIE',
                slug: 'phantom-beanie',
                description: 'Tight-knit urban beanie with embroidered studio logo.',
                price: 1500,
                category: getCatId('accessories'),
                images: ['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800'],
                variants: [
                    { size: 'FREE', stock: 50 }
                ],
                isFeatured: true
            },
            {
                name: 'ZENITH HOODIE - MIDNIGHT',
                slug: 'zenith-hoodie-midnight',
                description: 'Minimalist aesthetic with maximalist comfort. Washed fabric for a vintage feel.',
                price: 4800,
                category: getCatId('hoodies'),
                images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'],
                variants: [
                    { size: 'M', stock: 12 },
                    { size: 'L', stock: 15 }
                ],
                isFeatured: false
            }
        ];

        await Product.insertMany(productsData);
        console.log('🚀 Premium products seeded successfully!');

        process.exit();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

samples();
