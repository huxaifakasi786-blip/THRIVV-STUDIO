import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';

dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const categories = await Category.find();
        const products = await Product.find();
        console.log('--- DATABASE STATUS ---');
        console.log('Categories Count:', categories.length);
        console.log('Products Count:', products.length);
        if (products.length > 0) {
            console.log('First Product:', products[0].name, 'Featured:', products[0].isFeatured);
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
test();
