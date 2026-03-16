import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        uppercase: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    image: {
        type: String,
        required: [true, 'Category image is required']
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Middleware to generate slug before saving
categorySchema.pre('save', function (next) {
    if (this.isModified('name') || !this.slug) {
        this.slug = this.name.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
