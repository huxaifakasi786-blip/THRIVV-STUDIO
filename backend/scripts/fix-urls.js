import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Settings from '../models/Settings.js';
import Homepage from '../models/Homepage.js';

dotenv.config();

const fixUrls = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const oldUrl = 'http://localhost:5000';
        const newUrl = process.env.BACKEND_URL || 'https://thrivv-studio.onrender.com';
        
        console.log(`🔄 Migrating URLs from ${oldUrl} to ${newUrl}...`);

        // 1. Fix Products
        const products = await Product.find({ images: { $regex: oldUrl } });
        for (let p of products) {
            p.images = p.images.map(img => img.replace(oldUrl, newUrl));
            await p.save();
        }
        console.log(`✅ Fixed ${products.length} products`);

        // 2. Fix Categories
        const categories = await Category.find({ image: { $regex: oldUrl } });
        for (let c of categories) {
            c.image = c.image.replace(oldUrl, newUrl);
            await c.save();
        }
        console.log(`✅ Fixed ${categories.length} categories`);

        // 3. Fix Settings
        const settings = await Settings.findOne();
        if (settings) {
            if (settings.logoUrl?.includes(oldUrl)) settings.logoUrl = settings.logoUrl.replace(oldUrl, newUrl);
            if (settings.heroBannerUrl?.includes(oldUrl)) settings.heroBannerUrl = settings.heroBannerUrl.replace(oldUrl, newUrl);
            await settings.save();
            console.log(`✅ Fixed settings`);
        }

        // 4. Fix Homepage
        const homepage = await Homepage.findOne();
        if (homepage) {
            if (homepage.hero?.bannerUrl?.includes(oldUrl)) {
                homepage.hero.bannerUrl = homepage.hero.bannerUrl.replace(oldUrl, newUrl);
                await homepage.save();
                console.log(`✅ Fixed homepage`);
            }
        }

        console.log('🏁 Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

fixUrls();
