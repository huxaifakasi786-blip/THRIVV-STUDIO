import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const formatPrice = (price) => {
    return `Rs. ${Number(price).toLocaleString('en-PK')}`;
};

const TiltCard = ({ product }) => {
    const ref = useRef(null);
    const [hovered, setHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg']);

    const handleMouseMove = (e) => {
        if (!ref.current || window.innerWidth < 768) return;
        const rect = ref.current.getBoundingClientRect();
        const xPct = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const yPct = (e.clientY - rect.top - rect.height / 2) / rect.height;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setHovered(false);
        x.set(0);
        y.set(0);
    };

    // Handle both `image` (string) and `images` (array) fields
    const productImage = Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : product.image || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600';

    const productLink = `/products/${product._id || product.id}`;
    const isOnSale = product.salePrice && product.salePrice < product.price;
    const isSoldOut = product.totalStock === 0;

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{ rotateY, rotateX, transformStyle: 'preserve-3d' }}
            className="relative group w-full h-full cursor-pointer"
        >
            <Link to={productLink} className="block h-full">
                <div
                    className="bg-[#0d0d0d] rounded-none overflow-hidden border border-white/5 relative h-full flex flex-col"
                    style={{
                        boxShadow: hovered ? '0 25px 50px rgba(0,255,255,0.08), 0 0 0 1px rgba(0,255,255,0.1)' : '0 10px 30px rgba(0,0,0,0.5)',
                        transition: 'box-shadow 0.3s ease'
                    }}
                >
                    {/* Image Container */}
                    <div className="w-full aspect-[3/4] overflow-hidden relative bg-[#111]">
                        {isOnSale && (
                            <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest">
                                SALE
                            </div>
                        )}
                        {isSoldOut && (
                            <div className="absolute top-3 right-3 z-10 bg-black/80 border border-white/20 text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest">
                                SOLD OUT
                            </div>
                        )}
                        <motion.img
                            src={productImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            animate={{ scale: hovered ? 1.06 : 1 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600';
                            }}
                        />
                        {/* Dark overlay on hover with "SHOP NOW" */}
                        <motion.div
                            className="absolute inset-0 bg-black/40 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: hovered ? 1 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <span className="text-white text-xs font-black tracking-[0.3em] uppercase border border-white px-5 py-2">
                                VIEW ITEM
                            </span>
                        </motion.div>
                    </div>

                    {/* Card Info */}
                    <div className="p-4 flex flex-col flex-grow">
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">
                            {product.category?.name || 'Streetwear'}
                        </p>
                        <h3 className="text-white font-bold text-sm uppercase tracking-wide group-hover:text-[var(--color-accent)] transition-colors line-clamp-2 mb-3">
                            {product.name}
                        </h3>
                        <div className="mt-auto">
                            {isOnSale ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500 line-through text-xs">{formatPrice(product.price)}</span>
                                    <span className="text-red-500 font-black text-sm">{formatPrice(product.salePrice)}</span>
                                </div>
                            ) : (
                                <span className="text-white font-black text-sm">{formatPrice(product.price)}</span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default TiltCard;
