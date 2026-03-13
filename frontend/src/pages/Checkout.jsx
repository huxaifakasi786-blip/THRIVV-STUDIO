import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useSettingsStore from '../store/settingsStore';
import SEO from '../components/common/SEO';

const formatPrice = (price) => `Rs. ${Number(price).toLocaleString('en-PK')}`;

const Checkout = () => {
    const navigate = useNavigate();
    const { items, getCartTotal, placeOrder } = useCartStore();
    const { settings, fetchSettings } = useSettingsStore();
    
    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const subtotal = getCartTotal();
    const SHIPPING_FEE = settings?.shippingFee ?? 300;
    const FREE_SHIPPING_THRESHOLD = settings?.freeShippingThreshold ?? 5000;
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;

    const [formData, setFormData] = useState({
        firstName: '', lastName: '',
        email: '', phone: '',
        address: '', city: '',
        zipCode: '', province: 'Punjab',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        const result = await placeOrder(formData, 'COD', total);
        if (result.success) {
            navigate('/order-confirmation', {
                state: { orderNumber: result.order.orderNumber, email: formData.email, total }
            });
        } else {
            setError(result.message || 'Something went wrong. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 pt-24">
                <p className="section-label mb-3">Nothing to checkout</p>
                <h2 className="text-4xl font-black text-white uppercase mb-6" style={{ fontFamily: 'Oswald' }}>Your Cart is Empty</h2>
                <Link to="/products" className="btn-primary">Return to Shop</Link>
            </div>
        );
    }

    const InputField = ({ label, name, type = 'text', required = true, placeholder = '', col = 1 }) => (
        <div className={col === 2 ? 'md:col-span-2' : ''}>
            <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">
                {label}{required && ' *'}
            </label>
            <input
                type={type}
                name={name}
                required={required}
                value={formData[name]}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="input-field"
            />
        </div>
    );

    return (
        <div className="bg-black min-h-screen pt-28 pb-16">
            <SEO title="Checkout" description="Securely complete your purchase at THRIVV STUDIO. Premium urban streetwear delivered to your door." />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center gap-2 text-gray-600 text-[10px] uppercase tracking-[0.3em] mb-8">
                    <Link to="/cart" className="hover:text-white transition-colors">Cart</Link>
                    <ChevronRight size={10} />
                    <span className="text-white">Checkout</span>
                </div>
                <h1
                    className="text-4xl md:text-6xl font-black text-white uppercase mb-10 border-b border-white/5 pb-6"
                    style={{ fontFamily: 'Oswald' }}
                >
                    Checkout
                </h1>

                <div className="flex flex-col-reverse lg:flex-row gap-10">
                    {/* Form */}
                    <div className="flex-grow">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Contact */}
                            <div className="bg-[#0A0A0A] border border-white/5 p-6">
                                <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-5 pb-4 border-b border-white/5">
                                    Contact Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Email Address" name="email" type="email" placeholder="your@email.com" col={2} />
                                    <InputField label="Phone Number" name="phone" type="tel" placeholder="+92 300 1234567" col={2} />
                                </div>
                            </div>

                            {/* Shipping */}
                            <div className="bg-[#0A0A0A] border border-white/5 p-6">
                                <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-5 pb-4 border-b border-white/5">
                                    Shipping Address
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="First Name" name="firstName" placeholder="Muhammad" />
                                    <InputField label="Last Name" name="lastName" placeholder="Ali" />
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Street Address *</label>
                                        <input
                                            type="text" name="address" required
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="House #, Street, Area"
                                            className="input-field"
                                        />
                                    </div>
                                    <InputField label="City" name="city" placeholder="Lahore" />
                                    <InputField label="ZIP / Postal Code" name="zipCode" placeholder="54000" />
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Province *</label>
                                        <select
                                            name="province"
                                            value={formData.province}
                                            onChange={handleInputChange}
                                            className="input-field cursor-pointer"
                                        >
                                            {['Punjab', 'Sindh', 'KPK', 'Balochistan', 'AJK', 'Gilgit-Baltistan'].map(p => (
                                                <option key={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Payment - COD Only */}
                            <div className="bg-[#0A0A0A] border border-white/5 p-6">
                                <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-5 pb-4 border-b border-white/5">
                                    Payment Method
                                </h2>
                                <div className="border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/3 px-5 py-4 flex items-center gap-4">
                                    <div className="w-4 h-4 rounded-full border-2 border-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                                    </div>
                                    <div>
                                        <p className="text-white text-xs font-black uppercase tracking-widest">Cash on Delivery (COD)</p>
                                        <p className="text-gray-600 text-[10px] mt-0.5">Pay when your order arrives at your door.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 px-4 py-3">
                                    <p className="text-red-400 text-xs uppercase tracking-wider">{error}</p>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                id="place-order-btn"
                                className="w-full btn-primary py-5 text-sm disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? (
                                    <><div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" /> Processing...</>
                                ) : (
                                    <><ShieldCheck size={18} /> Place Order — {formatPrice(total)}</>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="bg-[#0A0A0A] border border-white/5 p-6 sticky top-28">
                            <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-5 pb-4 border-b border-white/5">
                                Your Order ({items.length})
                            </h2>

                            {/* Items */}
                            <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <div className="w-14 h-16 bg-[#111] flex-shrink-0 overflow-hidden relative">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            <span className="absolute top-0 right-0 bg-white text-black text-[9px] font-black w-4 h-4 flex items-center justify-center">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-white text-[11px] font-black uppercase line-clamp-1">{item.name}</p>
                                            <p className="text-gray-600 text-[10px]">Size: {item.size}</p>
                                        </div>
                                        <span className="text-white text-xs font-bold flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-white/5 pt-4 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-xs tracking-wider">Subtotal</span>
                                    <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-xs tracking-wider">Shipping</span>
                                    <span className="font-bold">
                                        {shipping === 0
                                            ? <span className="text-[var(--color-accent)]">FREE</span>
                                            : <span className="text-white">{formatPrice(shipping)}</span>
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-white/5 pt-3">
                                    <span className="text-white font-black text-xs uppercase tracking-widest">Total</span>
                                    <span
                                        className="text-xl font-black text-white"
                                        style={{ fontFamily: 'Oswald' }}
                                    >
                                        {formatPrice(total)}
                                    </span>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="mt-5 flex items-center gap-2 text-gray-700">
                                <Truck size={12} />
                                <span className="text-[10px] uppercase tracking-widest">
                                    {shipping === 0 ? 'Free shipping applied!' : `Rs. ${SHIPPING_FEE} delivery fee`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

