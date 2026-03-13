import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useProductStore from '../store/productStore';
import useSettingsStore from '../store/settingsStore';
import TiltCard from '../components/products/TiltCard';
import SEO from '../components/common/SEO';

const Home = () => {
    const { products, categories, fetchProducts, fetchCategories, loading } = useProductStore();
    const { settings, fetchSettings } = useSettingsStore();
    const [heroLoaded, setHeroLoaded] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchSettings();
        setHeroLoaded(true);
    }, [fetchProducts, fetchCategories, fetchSettings]);

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: (i = 0) => ({
            opacity: 1, y: 0,
            transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
        })
    };

    return (
        <div className="bg-black">
            <SEO title="Home" description="Welcome to THRIVV STUDIO. Premium urban streetwear for the bold and fearless in Pakistan." />

            {/* ===================== HERO ===================== */}
            <section className="hero-section" style={{ paddingTop: '88px' }}>
                {/* Background Image or Gradient */}
                <div className="absolute inset-0 z-0">
                    {settings?.heroBannerUrl ? (
                        <img
                            src={settings.heroBannerUrl}
                            alt="Hero Banner"
                            className="w-full h-full object-cover opacity-40"
                        />
                    ) : (
                        <div
                            className="w-full h-full"
                            style={{
                                background: 'radial-gradient(ellipse at 80% 50%, rgba(0,255,255,0.05) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(170,0,255,0.05) 0%, transparent 60%)'
                            }}
                        />
                    )}
                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent" />
                </div>

                <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-24">
                    <div className="max-w-7xl mx-auto">

                        {/* Drop Label */}
                        <motion.div
                            variants={fadeUp} initial="hidden" animate={heroLoaded ? "visible" : "hidden"} custom={0}
                            className="flex items-center gap-3 mb-6"
                        >
                            <span className="w-8 h-px bg-[var(--color-accent)]"></span>
                            <span className="text-[var(--color-accent)] text-[10px] font-black uppercase tracking-[0.5em]">
                                New Collection 2025
                            </span>
                        </motion.div>

                        {/* Hero Title */}
                        <div className="overflow-hidden mb-2">
                            <motion.h1
                                className="hero-title text-white"
                                variants={fadeUp} initial="hidden" animate={heroLoaded ? "visible" : "hidden"} custom={1}
                            >
                                {settings?.heroTitle?.split('\n')[0] || (settings?.heroTitle === '' ? '' : 'STREETWEAR')}
                            </motion.h1>
                        </div>
                        <div className="overflow-hidden mb-2">
                            <motion.h1
                                className="hero-title outline-text"
                                variants={fadeUp} initial="hidden" animate={heroLoaded ? "visible" : "hidden"} custom={2}
                            >
                                {settings?.heroTitle?.split('\n')[1] || (settings?.heroTitle === '' ? '' : 'COLLECTION')}
                            </motion.h1>
                        </div>

                        {/* Subtitle + CTA */}
                        <motion.div
                            className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6"
                            variants={fadeUp} initial="hidden" animate={heroLoaded ? "visible" : "hidden"} custom={3}
                        >
                            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                                {settings?.heroSubtitle || 'Premium quality apparel designed for the bold and fearless.'}
                            </p>
                            <div className="flex gap-4 flex-shrink-0">
                                <Link to="/products" className="btn-primary" id="hero-shop-btn">
                                    Shop Now
                                </Link>
                                <Link to="/products" className="btn-outline" id="hero-arrivals-btn">
                                    New Arrivals
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
                >
                    <span className="text-gray-600 text-[9px] uppercase tracking-[0.5em]">Scroll</span>
                    <div className="w-px h-10 bg-gradient-to-b from-gray-600 to-transparent" />
                </motion.div>
            </section>

            {/* ===================== MARQUEE TICKER ===================== */}
            <div className="border-y border-white/5 py-4 overflow-hidden bg-black">
                <div className="marquee-track">
                    {[...Array(2)].map((_, i) => (
                        <React.Fragment key={i}>
                            {['THRIVV STUDIO', '•', 'NEW DROP', '•', 'STREETWEAR', '•', 'COD AVAILABLE', '•', 'LAHORE PK', '•', 'PREMIUM FITS', '•', 'THRIVV STUDIO', '•', 'NEW DROP', '•', 'STREETWEAR', '•', 'COD AVAILABLE', '•', 'LAHORE PK', '•', 'PREMIUM FITS', '•'].map((text, idx) => (
                                <span
                                    key={`${i}-${idx}`}
                                    className={`px-6 text-[11px] font-black uppercase tracking-[0.3em] ${text === '•' ? 'text-[var(--color-accent)]' : 'text-gray-700'}`}
                                    style={{ fontFamily: 'Oswald' }}
                                >
                                    {text}
                                </span>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* ===================== CATEGORIES ===================== */}
            <section className="py-20 border-b border-white/5">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <p className="section-label mb-2">Browse by</p>
                            <h2 className="section-title">Categories</h2>
                        </div>
                        <Link to="/products" className="text-gray-500 hover:text-white text-[10px] uppercase tracking-[0.3em] transition-colors font-bold hidden sm:block">
                            View All →
                        </Link>
                    </div>

                    {categories.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
                            {categories.slice(0, 8).map((cat, i) => (
                                <Link key={cat._id} to={`/products?category=${cat._id}`} className="category-card bg-black block aspect-[3/4] relative group">
                                    <img
                                        src={cat.image || `https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600`}
                                        alt={cat.name}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-all duration-700"
                                    />
                                    <div className="category-card-overlay" />
                                    <div className="absolute bottom-0 left-0 p-5">
                                        <p className="text-white text-xs uppercase tracking-[0.3em] font-black" style={{ fontFamily: 'Oswald' }}>
                                            {cat.name}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
                            {['HOODIES', 'T-SHIRTS', 'CARGO PANTS', 'ACCESSORIES'].map((name, i) => (
                                <Link key={name} to="/products" className="category-card bg-[#0a0a0a] block aspect-[3/4] relative">
                                    <div className="w-full h-full bg-gradient-to-br from-white/3 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-5">
                                        <p className="text-white text-xs uppercase tracking-[0.3em] font-black" style={{ fontFamily: 'Oswald' }}>{name}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ===================== NEW DROPS ===================== */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <p className="section-label mb-2">Just dropped</p>
                            <h2 className="section-title">New Arrivals</h2>
                        </div>
                        <Link to="/products" className="btn-outline text-[10px] hidden sm:inline-flex">
                            Shop All
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="spinner"></div>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
                            {products.slice(0, 100).map((product) => (
                                <div key={product._id} className="bg-black">
                                    <TiltCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-700 text-xs uppercase tracking-widest">Products coming soon</p>
                        </div>
                    )}

                    <div className="text-center mt-8 sm:hidden">
                        <Link to="/products" className="btn-outline">Shop All</Link>
                    </div>
                </div>
            </section>

            {/* ===================== BRAND STATEMENT ===================== */}
            <section className="py-24 border-t border-white/5 overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="section-label mb-6">Our Philosophy</p>
                    <h2
                        className="text-4xl md:text-7xl font-black text-white uppercase leading-tight max-w-4xl mx-auto"
                        style={{ fontFamily: 'Oswald', letterSpacing: '-0.01em' }}
                    >
                        BUILT FOR THE <span className="outline-text" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)', color: 'transparent' }}>STREETS</span> OF PAKISTAN
                    </h2>
                    <p className="text-gray-600 text-sm mt-6 max-w-md mx-auto leading-relaxed">
                        Crafted with premium materials. Designed for those who refuse to blend in. Cash on delivery across Pakistan.
                    </p>
                    <div className="flex justify-center gap-4 mt-8">
                        <Link to="/products" className="btn-primary" id="brand-cta">Shop Collection</Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
