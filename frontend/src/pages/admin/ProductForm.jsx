import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Plus, Trash2, ArrowLeft, Upload, Link as LinkIcon } from 'lucide-react';
import useProductStore from '../../store/productStore';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const fileInputRef = useRef(null);

    const { products, categories, fetchCategories, addProduct, updateProduct } = useProductStore();

    const [loading, setLoading] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState(null);
    const [imageMode, setImageMode] = useState('url'); // 'url' | 'upload'

    const [formData, setFormData] = useState({
        name: '', slug: '', description: '',
        price: '', salePrice: '', category: '',
        images: [''], variants: [{ size: 'M', stock: 10 }],
        isFeatured: false
    });

    useEffect(() => {
        fetchCategories();
        if (isEdit) {
            const product = products.find(p => p._id === id);
            if (product) {
                setFormData({
                    ...product,
                    category: product.category?._id || product.category,
                    price: product.price?.toString(),
                    salePrice: product.salePrice?.toString() || '',
                    images: product.images?.length > 0 ? product.images : ['']
                });
            }
        }
    }, [id, isEdit, products, fetchCategories]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFormData(prev => ({
            ...prev,
            [name]: val,
            ...(name === 'name' ? { slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') } : {})
        }));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleFileUpload = async (index, file) => {
        if (!file) return;
        setUploadingIndex(index);
        try {
            const fd = new FormData();
            fd.append('image', file);
            const { data } = await API.post('/upload', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            handleImageChange(index, data.url);
            toast.success('Image uploaded!');
        } catch (err) {
            toast.error('Upload failed. Try a URL instead.');
        } finally {
            setUploadingIndex(null);
        }
    };

    const addImageField = () => setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    const removeImageField = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, images: newImages.length > 0 ? newImages : [''] }));
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index][field] = field === 'stock' ? parseInt(value) || 0 : value.toUpperCase();
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const addVariant = () => setFormData(prev => ({ ...prev, variants: [...prev.variants, { size: '', stock: 0 }] }));
    const removeVariant = (index) => {
        const newVariants = formData.variants.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        if (!formData.category) {
            toast.error('Please select a category');
            return;
        }

        setLoading(true);
        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
            images: formData.images.filter(img => img.trim() !== '')
        };
        const result = isEdit ? await updateProduct(id, payload) : await addProduct(payload);
        if (result.success) {
            toast.success(isEdit ? 'Product updated!' : 'Product created!');
            navigate('/admin/products');
        } else {
            toast.error(result.message || 'Failed to save product');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-5xl mx-auto pb-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={22} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black uppercase text-white tracking-wider">
                            {isEdit ? 'Edit Product' : 'Add Product'}
                        </h1>
                        <p className="text-gray-600 text-xs uppercase tracking-wider mt-0.5">
                            {isEdit ? 'Update product details and stock' : 'Add a new item to your catalog'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={() => navigate('/admin/products')} className="btn-outline px-5 py-2 text-xs">Cancel</button>
                    <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center gap-2 px-6 py-2 text-xs">
                        <Save size={14} />
                        {loading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Basic Info */}
                    <div className="bg-[#111] p-6 border border-white/5 space-y-4">
                        <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] border-b border-white/5 pb-3">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Product Name *</label>
                                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="admin-input" placeholder="e.g. Cyber Hoodie" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Slug (URL)</label>
                                <input type="text" name="slug" required value={formData.slug} onChange={handleInputChange} className="admin-input" placeholder="cyber-hoodie" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Description *</label>
                            <textarea name="description" required rows={4} value={formData.description} onChange={handleInputChange} className="admin-input resize-none" placeholder="Describe your product..." />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Price (Rs.) *</label>
                                <input type="number" name="price" required value={formData.price} onChange={handleInputChange} className="admin-input" placeholder="4500" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Sale Price (Rs.)</label>
                                <input type="number" name="salePrice" value={formData.salePrice} onChange={handleInputChange} className="admin-input" placeholder="Leave empty if no sale" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Category *</label>
                                <select name="category" required value={formData.category} onChange={handleInputChange} className="admin-input cursor-pointer">
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="w-4 h-4 rounded" />
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Feature on homepage</span>
                        </label>
                    </div>

                    {/* Variants */}
                    <div className="bg-[#111] p-6 border border-white/5 space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                            <h2 className="text-xs font-black text-white uppercase tracking-[0.3em]">Sizes & Stock</h2>
                            <button type="button" onClick={addVariant} className="text-[var(--color-accent)] hover:text-white flex items-center gap-1 text-[10px] font-black uppercase tracking-wider">
                                <Plus size={12} /> Add Size
                            </button>
                        </div>
                        <div className="space-y-2">
                            {formData.variants.map((v, i) => (
                                <div key={i} className="flex gap-3 items-end bg-black/40 p-3 border border-white/3">
                                    <div className="flex-grow">
                                        <label className="block text-[9px] font-black text-gray-600 uppercase tracking-wider mb-1">Size</label>
                                        <input type="text" value={v.size} required onChange={(e) => handleVariantChange(i, 'size', e.target.value)} className="admin-input py-2" placeholder="S, M, L, XL…" />
                                    </div>
                                    <div className="w-28">
                                        <label className="block text-[9px] font-black text-gray-600 uppercase tracking-wider mb-1">Stock</label>
                                        <input type="number" value={v.stock} required onChange={(e) => handleVariantChange(i, 'stock', e.target.value)} className="admin-input py-2 text-center" />
                                    </div>
                                    <button type="button" onClick={() => removeVariant(i)} className="mb-1 p-2 text-gray-700 hover:text-red-500 transition-colors" disabled={formData.variants.length === 1}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Images Section */}
                <div className="space-y-5">
                    <div className="bg-[#111] p-6 border border-white/5 space-y-4">
                        <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] border-b border-white/5 pb-3">Product Images</h2>

                        {/* Mode Toggle */}
                        <div className="flex border border-white/10 p-0.5">
                            <button
                                type="button"
                                onClick={() => setImageMode('url')}
                                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${imageMode === 'url' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                            >
                                <LinkIcon size={10} /> URL
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageMode('upload')}
                                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${imageMode === 'upload' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                            >
                                <Upload size={10} /> Device
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.images.map((img, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="relative flex items-center gap-2">
                                        {imageMode === 'url' ? (
                                            <input
                                                type="text"
                                                value={img}
                                                onChange={(e) => handleImageChange(i, e.target.value)}
                                                className="admin-input flex-grow text-xs py-2"
                                                placeholder="https://example.com/photo.jpg"
                                            />
                                        ) : (
                                            <div className="flex-grow">
                                                <label
                                                    className={`flex items-center justify-center gap-2 border border-dashed cursor-pointer py-3 transition-all text-xs font-bold uppercase tracking-wider ${uploadingIndex === i ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-white/10 text-gray-600 hover:border-white/30 hover:text-gray-400'}`}
                                                >
                                                    {uploadingIndex === i ? (
                                                        <><div className="spinner w-4 h-4" /> Uploading...</>
                                                    ) : img ? (
                                                        <><Upload size={12} /> Change Image</>
                                                    ) : (
                                                        <><Upload size={12} /> Choose from Device</>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleFileUpload(i, e.target.files[0])}
                                                        disabled={uploadingIndex !== null}
                                                    />
                                                </label>
                                            </div>
                                        )}
                                        {formData.images.length > 1 && (
                                            <button type="button" onClick={() => removeImageField(i)} className="text-gray-700 hover:text-red-500 flex-shrink-0">
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                    {img && (
                                        <div className="aspect-square overflow-hidden bg-black/50 border border-white/5">
                                            <img src={img} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                                        </div>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={addImageField} className="w-full py-2 border border-dashed border-white/10 text-gray-600 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 transition-all text-[10px] font-black uppercase tracking-[0.2em]">
                                + Add Another Image
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
