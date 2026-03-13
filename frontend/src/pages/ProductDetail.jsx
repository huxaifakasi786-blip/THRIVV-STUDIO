import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Minus, Plus, ShoppingCart, Star, Ruler, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../store/cartStore';
import useProductStore from '../store/productStore';
import SizeGuideModal from '../components/products/SizeGuideModal';
import TiltCard from '../components/products/TiltCard';
import SEO from '../components/common/SEO';

const formatPrice = (price) => `Rs. ${Number(price).toLocaleString('en-PK')}`;

const ProductDetail = () => {
    const { id } = useParams();
    const addItem = useCartStore(state => state.addItem);
    const { getProductById, products, fetchProducts } = useProductStore();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            const data = await getProductById(id);
            if (data) {
                setProduct(data);
                const imgs = Array.isArray(data.images) ? data.images : [];
                setMainImage(imgs[0] || data.image || '');
                if (data.variants?.length > 0) {
                    setSelectedSize(data.variants[0].size);
                }
            }
            setLoading(false);
        };
        fetchDetail();
        window.scrollTo(0, 0);
    }, [id, getProductById]);

    useEffect(() => {
        fetchProducts({});
    }, [fetchProducts]);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPos({ x, y, show: true });
    };

    const handleQuantityChange = (type) => {
        if (!product) return;
        const currentVariant = product.variants?.find(v => v.size === selectedSize);
        const maxStock = currentVariant ? currentVariant.stock : 0;
        if (type === 'dec' && quantity > 1) setQuantity(q => q - 1);
        else if (type === 'inc' && quantity < maxStock) setQuantity(q => q + 1);
    };

    const handleAddToCart = () => {
        if (!product) return;
        const currentVariant = product.variants?.find(v => v.size === selectedSize);
        if (!currentVariant || currentVariant.stock === 0) return;
        setIsAdding(true);
        addItem({
            productId: product._id,
            name: product.name,
            price: product.salePrice || product.price,
            image: Array.isArray(product.images) ? product.images[0] : product.image,
            size: selectedSize,
        }, quantity);
        setTimeout(() => {
            setIsAdding(false);
            setAdded(true);
            setTimeout(() => setAdded(false), 2500);
        }, 400);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-32 text-center">
                <p className="text-gray-600 text-xs uppercase tracking-[0.4em] mb-6">Item not found</p>
                <h2 className="text-4xl font-black text-white uppercase mb-8" style={{ fontFamily: 'Oswald' }}>Product Not Found</h2>
                <Link to="/products" className="btn-primary">Back to Shop</Link>
            </div>
        );
    }

    const productImages = Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image].filter(Boolean);
    const selectedVariant = product.variants?.find(v => v.size === selectedSize);
    const stockForSelectedSize = selectedVariant ? selectedVariant.stock : 0;
    const isOutOfStock = !selectedVariant || stockForSelectedSize === 0;
    const relatedProducts = products.filter(p => p._id !== product._id && p.category?._id === product.category?._id).slice(0, 4);

    return (
        <div className="bg-black min-h-screen pt-28">
            <SEO title={product.name} description={product.description?.substring(0, 160)} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[10px] text-gray-600 mb-10 uppercase tracking-[0.3em]">
                    <Link to="/" className="hover:text-white transition-colors">Home</Link>
                    <ChevronRight size={10} />
                    <Link to="/products" className="hover:text-white transition-colors">Shop</Link>
                    <ChevronRight size={10} />
                    <span className="text-gray-400 truncate max-w-[200px]">{product.name}</span>
                </nav>

                {/* Main Product Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">

                    {/* Image Gallery */}
                    <div className="flex flex-col-reverse md:flex-row gap-4">
                        {/* Thumbnails */}
                        {productImages.length > 1 && (
                            <div className="flex flex-row md:flex-col gap-2 md:w-20 flex-shrink-0">
                                {productImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMainImage(img)}
                                        className={`aspect-square overflow-hidden bg-[#111] border transition-all flex-shrink-0 md:w-full w-16 ${mainImage === img ? 'border-white' : 'border-white/5 hover:border-white/30'}`}
                                    >
                                        <img src={img} alt={`view ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Image with Zoom */}
                        <div
                            className="flex-grow aspect-[3/4] bg-[#0d0d0d] overflow-hidden relative cursor-zoom-in"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={() => setZoomPos({ ...zoomPos, show: false })}
                        >
                            <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                            {/* Sale Badge */}
                            {product.salePrice && product.salePrice < product.price && (
                                <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest">
                                    SALE
                                </div>
                            )}
                            {/* Zoom */}
                            {zoomPos.show && (
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        backgroundImage: `url(${mainImage})`,
                                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                        backgroundSize: '250%',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em] mb-3">
                            {product.category?.name || 'Streetwear'}
                        </p>
                        <h1
                            className="text-4xl md:text-5xl font-black text-white uppercase mb-4 leading-tight"
                            style={{ fontFamily: 'Oswald', letterSpacing: '-0.01em' }}
                        >
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="flex items-baseline gap-4 mb-6">
                            {product.salePrice && product.salePrice < product.price ? (
                                <>
                                    <span className="text-3xl font-black text-red-500">{formatPrice(product.salePrice)}</span>
                                    <span className="text-gray-600 line-through text-lg">{formatPrice(product.price)}</span>
                                    <span className="bg-red-600/10 text-red-500 text-[10px] font-black px-2 py-0.5 uppercase tracking-wider">
                                        Save {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                                    </span>
                                </>
                            ) : (
                                <span className="text-3xl font-black text-white">{formatPrice(product.price)}</span>
                            )}
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>
                            <span className="text-gray-600 text-xs">Customer Favorite</span>
                        </div>

                        <p className="text-gray-400 text-sm leading-relaxed mb-8">{product.description}</p>

                        <div className="border-t border-white/5 pt-8 space-y-6">
                            {/* Size Selection */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-white text-xs font-black uppercase tracking-[0.3em]">
                                        SIZE: <span className="text-[var(--color-accent)]">{selectedSize}</span>
                                    </span>
                                    <button
                                        onClick={() => setIsSizeGuideOpen(true)}
                                        className="flex items-center gap-1 text-gray-600 hover:text-white text-[10px] uppercase tracking-widest transition-colors"
                                    >
                                        <Ruler size={12} />
                                        Size Guide
                                    </button>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {product.variants?.map(v => (
                                        <button
                                            key={v.size}
                                            onClick={() => { if (v.stock > 0) { setSelectedSize(v.size); setQuantity(1); } }}
                                            disabled={v.stock === 0}
                                            className={`min-w-[48px] py-2 px-3 text-xs font-black uppercase border transition-all ${v.stock === 0 ? 'border-white/5 text-gray-700 cursor-not-allowed line-through' : selectedSize === v.size ? 'border-white bg-white text-black' : 'border-white/20 hover:border-white text-white'}`}
                                        >
                                            {v.size}
                                        </button>
                                    ))}
                                </div>
                                {!isOutOfStock && (
                                    <p className="text-gray-700 text-[10px] uppercase tracking-widest mt-2">
                                        {stockForSelectedSize} left in stock
                                    </p>
                                )}
                            </div>

                            {/* Quantity */}
                            <div>
                                <span className="text-white text-xs font-black uppercase tracking-[0.3em] block mb-3">Quantity</span>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleQuantityChange('dec')}
                                        disabled={quantity <= 1}
                                        className="w-10 h-10 border border-white/10 hover:border-white/40 text-white disabled:opacity-30 transition-colors flex items-center justify-center"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-12 h-10 flex items-center justify-center text-white font-black border-t border-b border-white/10 text-sm">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange('inc')}
                                        disabled={quantity >= stockForSelectedSize}
                                        className="w-10 h-10 border border-white/10 hover:border-white/40 text-white disabled:opacity-30 transition-colors flex items-center justify-center"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock || isAdding}
                                id="add-to-cart-btn"
                                className={`w-full py-4 font-black text-sm uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${isOutOfStock ? 'bg-white/5 text-gray-600 cursor-not-allowed' : added ? 'bg-[var(--color-accent)] text-black' : 'bg-white text-black hover:bg-[var(--color-accent)]'}`}
                            >
                                {added ? (
                                    <><Check size={16} /> Added to Cart</>
                                ) : isOutOfStock ? (
                                    'Out of Stock'
                                ) : isAdding ? (
                                    <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <><ShoppingCart size={16} /> Add to Cart — {formatPrice((product.salePrice || product.price) * quantity)}</>
                                )}
                            </button>

                            {/* Shipping Note */}
                            <div className="bg-white/3 border border-white/5 px-4 py-3">
                                <p className="text-gray-500 text-[10px] uppercase tracking-widest">
                                    🚚 Free shipping on orders over Rs. 5,000 · Cash on Delivery available
                                </p>
                            </div>
                        </div>

                        {/* Product Features */}
                        {product.features?.length > 0 && (
                            <div className="mt-8 border-t border-white/5 pt-8">
                                <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-4">Details</h3>
                                <ul className="space-y-2">
                                    {product.features.map((feat, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-400 text-xs">
                                            <span className="text-[var(--color-accent)] mt-0.5 flex-shrink-0">—</span>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="border-t border-white/5 pt-16 pb-24">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <p className="section-label mb-2">You may also like</p>
                                <h2 className="section-title">Related Items</h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
                            {relatedProducts.map(p => (
                                <div key={p._id} className="bg-black">
                                    <TiltCard product={p} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Size Guide Modal */}
            <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
        </div>
    );
};

export default ProductDetail;
