import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    siteName: { type: String, default: 'THRIVV STUDIO' },
    siteDescription: { type: String, default: 'Vanguard Streetwear & Cyberpunk Aesthetics' },
    contactEmail: { type: String, default: 'contact@thrivv.studio' },
    contactPhone: { type: String, default: '+92 300 1234567' },
    address: { type: String, default: 'Lahore, Pakistan' },
    logoUrl: { type: String, default: '' },
    socialLinks: {
        instagram: { type: String, default: 'https://instagram.com' },
        facebook: { type: String, default: 'https://facebook.com' },
        twitter: { type: String, default: 'https://twitter.com' },
        tiktok: { type: String, default: 'https://tiktok.com' }
    },
    heroTitle: { type: String, default: 'STREETWEAR \nCOLLECTION' },
    heroSubtitle: { type: String, default: 'Discover the latest drops. Premium quality apparel designed for the bold and fearless.' },
    heroBannerUrl: { type: String, default: '' },
    footerText: { type: String, default: 'ALL RIGHTS RESERVED.' },
    shippingFee: { type: Number, default: 300 },
    freeShippingThreshold: { type: Number, default: 5000 }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
