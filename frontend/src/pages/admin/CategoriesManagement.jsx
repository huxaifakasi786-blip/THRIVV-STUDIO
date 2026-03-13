import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Folder, Upload, Link as LinkIcon } from 'lucide-react';
import useProductStore from '../../store/productStore';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const CategoriesManagement = () => {
    const { categories, fetchCategories, addCategory, deleteCategory, products, fetchProducts, loading } = useProductStore();
    const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '', status: 'Active', image: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Image Upload State
    const [imageMode, setImageMode] = useState('url'); // 'url' | 'upload'
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [fetchCategories, fetchProducts]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCategory(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'name') {
                updated.slug = value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            }
            return updated;
        });
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        setIsUploadingImage(true);
        try {
            const fd = new FormData();
            fd.append('image', file);
            const { data } = await API.post('/upload', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setNewCategory(prev => ({ ...prev, image: data.url }));
            toast.success('Image uploaded!');
        } catch (err) {
            toast.error('Upload failed. Try a URL instead.');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newCategory.name) return;

        setIsSubmitting(true);
        const result = await addCategory(newCategory);
        if (result.success) {
            toast.success('Category created!');
            setNewCategory({ name: '', slug: '', description: '', status: 'Active', image: '' });
        } else {
            toast.error(result.message || 'Failed to create category');
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure? This might affect products in this category.')) {
            const result = await deleteCategory(id);
            if (!result.success) toast.error(result.message);
            else toast.success('Category deleted');
        }
    };

    const getProductCount = (categoryId) => {
        return products.filter(p => p.category?._id === categoryId).length;
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">Categories</h1>
                    <p className="text-gray-400 text-sm mt-1">Organize your product catalog</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Categories List */}
                <div className="lg:col-span-2">
                    <div className="bg-[#111] border border-white/5 rounded-lg overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-black/50 text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                                        <th className="px-6 py-4 font-bold">Category Name</th>
                                        <th className="px-6 py-4 font-bold hidden sm:table-cell">Slug</th>
                                        <th className="px-6 py-4 font-bold text-center">Products</th>
                                        <th className="px-6 py-4 font-bold text-center">Status</th>
                                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading...</td></tr>
                                    ) : categories.map((category) => (
                                        <tr key={category._id} className="hover:bg-white/5 transition-colors group text-sm">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    {category.image ? (
                                                        <div className="w-8 h-8 rounded bg-black overflow-hidden border border-white/10">
                                                            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <Folder className="text-gray-500 w-5 h-5" />
                                                    )}
                                                    <span className="text-white font-bold">{category.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">
                                                /{category.slug}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="bg-black border border-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
                                                    {getProductCount(category._id)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end space-x-3 opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleDelete(category._id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors tooltip" title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Quick Add Form */}
                <div className="lg:col-span-1">
                    <div className="bg-[#111] border border-white/5 rounded-lg p-6 sticky top-6">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-6 pb-4 border-b border-white/10">Quick Add</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={newCategory.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm"
                                    placeholder="e.g., T-Shirts"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Slug *</label>
                                <input
                                    type="text"
                                    name="slug"
                                    required
                                    value={newCategory.slug}
                                    onChange={handleInputChange}
                                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm"
                                    placeholder="e.g., t-shirts"
                                />
                            </div>

                            {/* Image Section */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category Image</label>

                                <div className="flex border border-white/10 p-0.5 mb-2">
                                    <button
                                        type="button"
                                        onClick={() => setImageMode('url')}
                                        className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${imageMode === 'url' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        <LinkIcon size={10} /> URL
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setImageMode('upload')}
                                        className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${imageMode === 'upload' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        <Upload size={10} /> Device
                                    </button>
                                </div>

                                {imageMode === 'url' ? (
                                    <input
                                        type="text"
                                        name="image"
                                        value={newCategory.image || ''}
                                        onChange={handleInputChange}
                                        className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm"
                                        placeholder="https://image-url.com/cat.jpg"
                                    />
                                ) : (
                                    <label className={`flex items-center justify-center gap-2 border border-dashed cursor-pointer py-3 transition-all text-xs font-bold uppercase tracking-wider ${isUploadingImage ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-white/10 text-gray-600 hover:border-white/30'}`}>
                                        {isUploadingImage ? (
                                            <><div className="spinner w-4 h-4" /> Uploading...</>
                                        ) : newCategory.image ? (
                                            <><Upload size={12} /> Replace Image</>
                                        ) : (
                                            <><Upload size={12} /> Choose File</>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileUpload(e.target.files[0])}
                                            disabled={isUploadingImage}
                                        />
                                    </label>
                                )}

                                {newCategory.image && (
                                    <div className="mt-3 aspect-video bg-black/50 border border-white/5 rounded overflow-hidden">
                                        <img src={newCategory.image} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                                <textarea
                                    name="description"
                                    rows="2"
                                    value={newCategory.description}
                                    onChange={handleInputChange}
                                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm"
                                    placeholder="Category description..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || isUploadingImage}
                                className="w-full btn-primary py-3 text-sm mt-4 uppercase tracking-wider disabled:opacity-50"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Category'}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CategoriesManagement;

