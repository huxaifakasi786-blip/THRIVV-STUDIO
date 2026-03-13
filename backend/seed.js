import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;

        // Clear existing collections
        await db.collection('users').deleteMany({});
        await db.collection('products').deleteMany({});
        await db.collection('categories').deleteMany({});
        await db.collection('settings').deleteMany({});

        // Admin User (pre-hashed password to skip middleware)
        const hashedPassword = bcryptjs.hashSync('admin123', 10);
        await db.collection('users').insertOne({
            username: 'admin',
            password: hashedPassword,
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log('✅ Admin user created: admin / admin123');

        // Settings
        await db.collection('settings').insertOne({
            siteName: 'THRIVV STUDIO',
            siteDescription: 'Premium streetwear collection for the bold.',
            contactEmail: 'contact@thrivv.studio',
            contactPhone: '+92 300 1234567',
            address: 'Lahore, Pakistan',
            logoUrl: '',
            heroBannerUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1600',
            socialLinks: {
                instagram: 'https://instagram.com',
                facebook: 'https://facebook.com',
                twitter: 'https://twitter.com',
                tiktok: 'https://tiktok.com'
            },
            heroTitle: 'STREETWEAR\nCOLLECTION',
            heroSubtitle: 'Discover the latest drops. Premium quality apparel designed for the bold and fearless.',
            footerText: 'ALL RIGHTS RESERVED.',
            shippingFee: 200,
            freeShippingThreshold: 5000,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log('✅ Settings created');

        // Categories
        const cats = await db.collection('categories').insertMany([
            { name: 'Hoodies', slug: 'hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600', createdAt: new Date() },
            { name: 'T-Shirts', slug: 't-shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600', createdAt: new Date() },
            { name: 'Cargo Pants', slug: 'cargo-pants', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&q=80&w=600', createdAt: new Date() },
            { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1521369909029-2afed882ba54?auto=format&fit=crop&q=80&w=600', createdAt: new Date() },
        ]);
        const catIds = Object.values(cats.insertedIds);
        console.log('✅ 4 categories seeded');

        // Products
        await db.collection('products').insertMany([
            {
                name: 'VORTEX HEAVYWEIGHT HOODIE',
                slug: 'vortex-heavyweight-hoodie',
                description: 'Premium 400gsm cotton blend streetwear hoodie with custom embroidery.',
                price: 4500,
                salePrice: null,
                images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600'],
                category: catIds[0],
                isFeatured: true,
                features: ['400gsm heavyweight cotton', 'Custom embroidered logo', 'Kangaroo pocket', 'Ribbed cuffs and hem'],
                variants: [
                    { size: 'S', stock: 10 }, { size: 'M', stock: 15 },
                    { size: 'L', stock: 12 }, { size: 'XL', stock: 8 }, { size: 'XXL', stock: 5 }
                ],
                totalStock: 50,
                createdAt: new Date()
            },
            {
                name: 'PHANTOM OVERSIZED TEE',
                slug: 'phantom-oversized-tee',
                description: 'Ultra-soft 220gsm oversized graphic tee with bold THRIVV chest print.',
                price: 2500,
                salePrice: 1999,
                images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600'],
                category: catIds[1],
                isFeatured: true,
                features: ['220gsm combed cotton', 'Oversized drop-shoulder fit', 'Bold THRIVV chest print', 'Pre-washed for softness'],
                variants: [
                    { size: 'S', stock: 20 }, { size: 'M', stock: 25 },
                    { size: 'L', stock: 18 }, { size: 'XL', stock: 10 }
                ],
                totalStock: 73,
                createdAt: new Date()
            },
            {
                name: 'TACTICAL CARGO PANTS',
                slug: 'tactical-cargo-pants',
                description: 'Multi-pocket tactical cargo pants built for both street and style.',
                price: 5500,
                salePrice: null,
                images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&q=80&w=600'],
                category: catIds[2],
                isFeatured: true,
                features: ['Ripstop fabric', '8 functional pockets', 'Tapered relaxed fit', 'Adjustable ankle cuffs'],
                variants: [
                    { size: 'S', stock: 8 }, { size: 'M', stock: 12 },
                    { size: 'L', stock: 10 }, { size: 'XL', stock: 6 }
                ],
                totalStock: 36,
                createdAt: new Date()
            },
            {
                name: 'CYBER BEANIE',
                slug: 'cyber-beanie',
                description: 'Ribbed acrylic beanie with woven THRIVV STUDIO patch.',
                price: 1200,
                salePrice: null,
                images: ['https://images.unsplash.com/photo-1521369909029-2afed882ba54?auto=format&fit=crop&q=80&w=600'],
                category: catIds[3],
                isFeatured: true,
                features: ['100% acrylic ribbed knit', 'Woven logo patch', 'One size fits most'],
                variants: [{ size: 'ONE SIZE', stock: 30 }],
                totalStock: 30,
                createdAt: new Date()
            },
        ]);
        console.log('✅ 4 products seeded');

        console.log('\n🎉 Database seeded successfully!');
        console.log('🔑 Admin login: admin / admin123');
        console.log('🌐 Frontend: http://127.0.0.1:5173');
        console.log('⚙️  Admin Panel: http://127.0.0.1:5173/admin/login');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
};

seedData();
