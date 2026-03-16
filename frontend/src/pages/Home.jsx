import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useProductStore from '../store/productStore';
import useSettingsStore from '../store/settingsStore';
import useHomepageStore from '../store/homepageStore';
import TiltCard from '../components/products/TiltCard';
import SEO from '../components/common/SEO';

const Home = () => {
    const { products, categories, fetchProducts, fetchCategories, loading } = useProductStore();
    const { settings, fetchSettings } = useSettingsStore();
    const { homepage, fetchHomepage } = useHomepageStore();
    const [heroLoaded, setHeroLoaded] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchSettings();
        fetchHomepage();
        setHeroLoaded(true);
    }, [fetchProducts, fetchCategories, fetchSettings, fetchHomepage]);

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: (i = 0) => ({
            opacity: 1, y: 0,
            transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
        })
    };

    const hero = homepage?.hero || settings;

    return (
        <div className="bg-black">
            <SEO title="Home" description={settings?.siteDescription || "Welcome to THRIVV STUDIO. Premium urban streetwear."} />

            {/* ===================== HERO ===================== */}
            <section className="hero-section" style={{ paddingTop: '88px' }}>
                <div className="absolute inset-0 z-0">
                    {(hero?.heroBannerUrl || hero?.bannerUrl) ? (
                        <img
                            src={hero.heroBannerUrl || hero.bannerUrl}
                            alt="Hero Banner"
                            className="w-full h-full object-cover opacity-40"
                        />
                    ) : (
                        <div className="w-full h-full" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(255,0,0,0.05) 0%, transparent 60%)' }} />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent" />
                </div>

                <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-24">
                    <div className="max-w-7xl mx-auto">
                        <motion.div variants={fadeUp} initial="hidden" animate={heroLoaded ? "visible" : "hidden"} custom={0} className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-px bg-[var(--color-accent)]"></span>
                            <span className="text-[var(--color-accent)] text-[10px] font-black uppercase tracking-[0.5em]">New Drop 2026</span>
                        </motion.div>

                        <div className="overflow-hidden mb-2">
                            <motion.h1 className="hero-title text-white" variants={fadeUp} initial="hidden" animate={heroLoaded ? "visible" : "hidden"} custom={1}>
                                {(hero?.heroTitle || hero?.title || 'STREETWEAR\nCOLLECTION').split('\n')[0]}
                            </motion.h1>
                        </div>
                        <div className="overflow-hidden mb-2">
                            <motion.h1 className="hero-title outline-text" variants={fadeUp} initial="hidden" animate={heroLoaded ? "visible" : "hidden"} custom={2}>
                                {(hero?.heroTitle || hero?.title || 'STREETWEAR\nCOLLECTION').split('\n')[1]}
                            </motion.h1>
                        </div>

                        <motion.div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6" variants={fadeUp} initial="hidden" animate={heroLoaded ? "visible" : "hidden"} custom={3}>
                            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                                {hero?.heroSubtitle || hero?.subtitle || 'Premium quality apparel designed for the bold and fearless.'}
                            </p>
                            <div className="flex gap-4">
                                <Link to={hero?.buttonLink || "/products"} className="btn-primary">
                                    {hero?.buttonText || "Shop Now"}
                                </Link>
                                <Link to="/products" className="btn-outline">New Arrivals</Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Dynamic Sections */}
            {homepage?.sections?.filter(s => s.active).map((section, sIdx) => (
                <section key={section._id || sIdx} className="py-20 border-b border-white/5">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <p className="section-label mb-2">{section.subtitle || 'THRIVV STUDIO'}</p>
                                <h2 className="section-title">{section.title}</h2>
                            </div>
                        </div>

                        {section.type === 'featured_products' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
                                {(section.items?.length > 0 ? section.items : products.slice(0, 4)).map(p => (
                                    <div key={p._id} className="bg-black"><TiltCard product={p} /></div>
                                ))}
                            </div>
                        )}

                        {section.type === 'categories_grid' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
                                {(section.categories?.length > 0 ? section.categories : categories.slice(0, 4)).map(cat => (
                                    <Link key={cat._id} to={`/products?category=${cat._id}`} className="category-card bg-black block aspect-[3/4] relative group">
                                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-all duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                        <div className="absolute bottom-0 left-0 p-5">
                                            <p className="text-white text-xs uppercase tracking-[0.3em] font-black" style={{ fontFamily: 'Oswald' }}>{cat.name}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            ))}

            {/* Static Sections as Fallback if no homepage data */}
            {(!homepage?.sections || homepage.sections.length === 0) && (
                <>
                    <section className="py-20 border-b border-white/5">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-end mb-10">
                                <div><p className="section-label mb-2">Browse by</p><h2 className="section-title">Categories</h2></div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
                                {categories.slice(0, 4).map(cat => (
                                    <Link key={cat._id} to={`/products?category=${cat._id}`} className="category-card bg-black block aspect-[3/4] relative group">
                                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-all duration-700" />
                                        <div className="absolute bottom-0 left-0 p-5">
                                            <p className="text-white text-xs uppercase tracking-[0.3em] font-black" style={{ fontFamily: 'Oswald' }}>{cat.name}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section className="py-20">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-end mb-10">
                                <div><p className="section-label mb-2">Just dropped</p><h2 className="section-title">New Arrivals</h2></div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
                                {products.slice(0, 8).map(p => (
                                    <div key={p._id} className="bg-black"><TiltCard product={p} /></div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            )}

            <section className="py-24 border-t border-white/5 overflow-hidden text-center">
                <p className="section-label mb-6">Our Philosophy</p>
                <h2 className="text-4xl md:text-7xl font-black text-white uppercase leading-tight max-w-4xl mx-auto" style={{ fontFamily: 'Oswald', letterSpacing: '-0.01em' }}>
                    BUILT FOR THE <span className="outline-text" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)', color: 'transparent' }}>STREETS</span> OF PAKISTAN
                </h2>
                <div className="flex justify-center gap-4 mt-8">
                    <Link to="/products" className="btn-primary">Shop Collection</Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
