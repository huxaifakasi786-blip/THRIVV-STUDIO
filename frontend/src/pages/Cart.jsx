import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import useCartStore from '../store/cartStore';
import SEO from '../components/common/SEO';

const formatPrice = (price) => `Rs. ${Number(price).toLocaleString('en-PK')}`;

const Cart = () => {
    const { items, updateQuantity, removeItem, getCartTotal } = useCartStore();

    const subtotal = getCartTotal();
    const SHIPPING = 300;
    const freeShippingThreshold = 5000;
    const shipping = subtotal >= freeShippingThreshold ? 0 : (items.length > 0 ? SHIPPING : 0);
    const total = subtotal + shipping;
    const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 pt-24">
                <ShoppingBag size={48} className="text-gray-700 mb-6" strokeWidth={1} />
                <p className="section-label mb-3">Nothing here yet</p>
                <h2
                    className="text-5xl font-black text-white uppercase mb-6"
                    style={{ fontFamily: 'Oswald' }}
                >
                    Your Cart is Empty
                </h2>
                <p className="text-gray-600 text-sm mb-8 max-w-xs">
                    Looks like you haven't added anything to your cart yet.
                </p>
                <Link to="/products" className="btn-primary" id="continue-shopping-btn">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen pt-28 pb-16">
            <SEO title="Your Cart" description="Review your selection at THRIVV STUDIO. Premium urban streetwear ready for delivery." />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* Page Header */}
                <div className="border-b border-white/5 pb-6 mb-10">
                    <p className="section-label mb-2">Your Selection</p>
                    <h1
                        className="text-4xl md:text-6xl font-black text-white uppercase"
                        style={{ fontFamily: 'Oswald' }}
                    >
                        Cart <span className="text-gray-700">({items.length})</span>
                    </h1>
                </div>

                {/* Free Shipping Progress */}
                {subtotal < freeShippingThreshold && (
                    <div className="mb-8 bg-white/3 border border-white/5 px-5 py-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em]">
                                Add <span className="text-white font-black">{formatPrice(freeShippingThreshold - subtotal)}</span> more for free shipping
                            </p>
                            <p className="text-gray-700 text-[10px] uppercase tracking-widest">{Math.round(progressToFreeShipping)}%</p>
                        </div>
                        <div className="h-px bg-white/5">
                            <div
                                className="h-full bg-[var(--color-accent)] transition-all duration-500"
                                style={{ width: `${progressToFreeShipping}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Cart Items */}
                    <div className="flex-grow">
                        {/* Header Row (Desktop) */}
                        <div className="hidden md:grid grid-cols-12 gap-4 border-b border-white/5 pb-3 mb-1">
                            {['Product', 'Price', 'Qty', 'Total'].map((h, i) => (
                                <div
                                    key={h}
                                    className={`text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] ${i === 0 ? 'col-span-6' : i === 3 ? 'col-span-2 text-right' : 'col-span-2 text-center'}`}
                                >
                                    {h}
                                </div>
                            ))}
                        </div>

                        <div className="divide-y divide-white/5">
                            {items.map((item) => (
                                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6">

                                    {/* Product Info */}
                                    <div className="col-span-6 flex items-center gap-4">
                                        <Link to={`/products/${item.productId}`} className="w-20 h-24 flex-shrink-0 bg-[#111] overflow-hidden block">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </Link>
                                        <div>
                                            <Link to={`/products/${item.productId}`} className="text-white font-black text-sm uppercase hover:text-[var(--color-accent)] transition-colors line-clamp-2 block mb-1">
                                                {item.name}
                                            </Link>
                                            <p className="text-gray-600 text-[10px] uppercase tracking-widest">Size: {item.size}</p>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="col-span-2 text-center">
                                        <p className="text-white text-sm font-bold">{formatPrice(item.price)}</p>
                                    </div>

                                    {/* Quantity */}
                                    <div className="col-span-2 flex justify-center items-center">
                                        <div className="flex items-center border border-white/10">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="w-8 h-8 flex items-center justify-center text-white text-sm font-black">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Total + Remove */}
                                    <div className="col-span-2 flex justify-end items-center gap-3">
                                        <span className="text-white font-black text-sm">{formatPrice(item.price * item.quantity)}</span>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-700 hover:text-red-500 transition-colors"
                                            title="Remove"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="bg-[#0A0A0A] border border-white/5 p-6 sticky top-28">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-6 pb-4 border-b border-white/5">
                                Order Summary
                            </h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 text-xs uppercase tracking-wider">Subtotal</span>
                                    <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 text-xs uppercase tracking-wider">Shipping</span>
                                    <span className="font-bold text-white">
                                        {shipping === 0 ? <span className="text-[var(--color-accent)]">FREE</span> : formatPrice(shipping)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-baseline border-t border-white/5 pt-4 mb-6">
                                <span className="text-white text-xs font-black uppercase tracking-[0.3em]">Total</span>
                                <span
                                    className="text-2xl font-black text-white"
                                    style={{ fontFamily: 'Oswald' }}
                                >
                                    {formatPrice(total)}
                                </span>
                            </div>
                            <Link
                                to="/checkout"
                                className="btn-primary w-full py-4 flex items-center justify-center gap-3"
                                id="checkout-btn"
                            >
                                Checkout <ArrowRight size={16} />
                            </Link>
                            <Link to="/products" className="block text-center text-gray-700 hover:text-white text-[10px] uppercase tracking-[0.3em] mt-4 transition-colors">
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
