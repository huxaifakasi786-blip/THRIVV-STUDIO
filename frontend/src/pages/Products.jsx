import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown } from 'lucide-react';
import TiltCard from '../components/products/TiltCard';
import useProductStore from '../store/productStore';
import SEO from '../components/common/SEO';

const Products = () => {
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { products, categories, fetchProducts, fetchCategories, loading } = useProductStore();
    const [activeSize, setActiveSize] = useState(null);
    const [sortBy, setSortBy] = useState('Newest');

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        const categoryId = searchParams.get('category');
        const slug = searchParams.get('slug');

        if (categoryId) {
            fetchProducts({ category: categoryId });
        } else if (slug && categories.length > 0) {
            const category = categories.find(c => c.slug === slug);
            if (category) {
                fetchProducts({ category: category._id });
            } else {
                fetchProducts({});
            }
        } else {
            fetchProducts({});
        }
    }, [searchParams, fetchProducts, categories]);

    const handleCategoryChange = (categoryId) => {
        if (categoryId) {
            setSearchParams({ category: categoryId });
        } else {
            setSearchParams({});
        }
        setActiveSize(null);
        setIsMobileFiltersOpen(false);
    };

    const categoryParam = searchParams.get('category');
    const slugParam = searchParams.get('slug');
    const activeCategory = categoryParam || (slugParam && categories.find(c => c.slug === slugParam)?._id);
    const activeCategoryName = categories.find(c => c._id === activeCategory)?.name || 'All Products';

    // Apply Client-side filtering for size and sorting
    let displayedProducts = [...products];

    if (activeSize) {
        displayedProducts = displayedProducts.filter(p => 
            p.variants.some(v => v.size === activeSize && v.stock > 0)
        );
    }

    if (sortBy === 'Price: Low → High') {
        displayedProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === 'Price: High → Low') {
        displayedProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else {
        displayedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const FilterSidebar = () => (
        <div className="space-y-6">
            <div>
                <h3 className="font-black text-white mb-4 uppercase tracking-[0.2em] text-xs border-b border-white/10 pb-3">
                    Categories
                </h3>
                <div className="space-y-1">
                    <button
                        onClick={() => handleCategoryChange(null)}
                        className={`w-full text-left py-2 px-3 text-xs uppercase tracking-widest transition-all ${!activeCategory ? 'text-white bg-white/5 font-black' : 'text-gray-500 hover:text-white'}`}
                    >
                        All Products ({products.length || ''})
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat._id}
                            onClick={() => handleCategoryChange(cat._id)}
                            className={`w-full text-left py-2 px-3 text-xs uppercase tracking-widest transition-all ${activeCategory === cat._id ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/5 font-black' : 'text-gray-500 hover:text-white'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-black text-white mb-4 uppercase tracking-[0.2em] text-xs border-b border-white/10 pb-3">Sizes</h3>
                <div className="grid grid-cols-3 gap-1">
                    {['S', 'M', 'L', 'XL'].map(size => (
                        <button 
                            key={size} 
                            onClick={() => setActiveSize(activeSize === size ? null : size)}
                            className={`border py-2 text-xs font-bold uppercase tracking-widest transition-all ${activeSize === size ? 'border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/10' : 'border-white/10 text-gray-400 hover:border-white hover:text-white'}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-16">
            <SEO title={activeCategoryName} description={`Browse our collection of ${activeCategoryName}. Premium urban streetwear from THRIVV STUDIO.`} />
            {/* Page Header */}
            <div className="border-b border-white/10 py-6 px-4 sm:px-6 lg:px-8 mb-8">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <p className="text-gray-600 text-[10px] uppercase tracking-[0.3em] mb-1">
                            {activeCategory ? `/ ${activeCategoryName}` : '/ All Collections'}
                        </p>
                        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                            {activeCategoryName}
                        </h1>
                        {!loading && (
                            <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">
                                {displayedProducts.length} {displayedProducts.length === 1 ? 'item' : 'items'}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden flex items-center gap-2 border border-white/20 text-white py-2 px-4 text-xs uppercase tracking-widest hover:bg-white/5 transition-colors"
                            onClick={() => setIsMobileFiltersOpen(true)}
                        >
                            <Filter size={14} />
                            Filter
                        </button>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-black border border-white/10 hover:border-white/30 text-white py-2 px-4 text-xs uppercase tracking-widest focus:outline-none transition-colors cursor-pointer"
                        >
                            <option>Newest</option>
                            <option>Price: Low → High</option>
                            <option>Price: High → Low</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex gap-8 lg:gap-12">
                    {/* Desktop Sidebar */}
                    <aside className="hidden md:block w-52 flex-shrink-0">
                        <div className="sticky top-28">
                            <FilterSidebar />
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-grow">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="text-center">
                                    <div className="w-8 h-8 border-t-2 border-[var(--color-accent)] rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-500 text-xs uppercase tracking-widest">Loading...</p>
                                </div>
                            </div>
                        ) : displayedProducts.length === 0 ? (
                            <div className="text-center py-24">
                                <p className="text-gray-600 text-xs uppercase tracking-[0.3em] mb-6">No products found</p>
                                <button
                                    onClick={() => handleCategoryChange(null)}
                                    className="text-white border border-white/20 px-8 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                                >
                                    View All Products
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-white/5">
                                {displayedProducts.map((product) => (
                                    <div key={product._id} className="bg-black" id={`product-${product._id}`}>
                                        <TiltCard product={product} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile Filters Modal */}
            {isMobileFiltersOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div className="absolute inset-0 bg-black/80" onClick={() => setIsMobileFiltersOpen(false)}></div>
                    <div className="relative w-72 h-full bg-[#0A0A0A] p-6 overflow-y-auto border-r border-white/10">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Filter</h2>
                            <button onClick={() => setIsMobileFiltersOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <FilterSidebar />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
