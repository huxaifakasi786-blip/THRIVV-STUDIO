import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        uppercase: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    salePrice: {
        type: Number,
        default: null,
        min: 0
    },
    images: {
        type: [String],
        required: [true, 'At least one image is required']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    variants: [
        {
            size: {
                type: String,
                required: true,
                trim: true,
                uppercase: true
            },
            stock: {
                type: Number,
                required: true,
                default: 0,
                min: 0
            }
        }
    ],
    isFeatured: {
        type: Boolean,
        default: false
    },
    totalStock: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Middleware to calculate total stock
productSchema.pre('save', async function () {
    if (this.variants && this.variants.length > 0) {
        this.totalStock = this.variants.reduce((total, variant) => total + variant.stock, 0);
    }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
