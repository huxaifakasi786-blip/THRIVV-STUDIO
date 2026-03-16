import mongoose from 'mongoose';

const homepageSchema = new mongoose.Schema({
    hero: {
        title: { type: String, default: 'STREETWEAR\nCOLLECTION' },
        subtitle: { type: String, default: 'PREMIUM QUALITY URBAN ATTIRE' },
        bannerUrl: { type: String },
        buttonText: { type: String, default: 'SHOP NOW' },
        buttonLink: { type: String, default: '/products' }
    },
    sections: [
        {
            type: { 
                type: String, 
                enum: ['featured_products', 'categories_grid', 'banner_countdown', 'text_block'],
                required: true 
            },
            title: { type: String },
            subtitle: { type: String },
            items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
            categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
            content: { type: String },
            active: { type: Boolean, default: true },
            order: { type: Number, default: 0 }
        }
    ]
}, {
    timestamps: true
});

const Homepage = mongoose.model('Homepage', homepageSchema);

export default Homepage;
