import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle, Truck, Package, ShoppingBag } from 'lucide-react';

const OrderConfirmation = () => {
    const location = useLocation();
    const orderDetails = location.state;

    // Protect route if accessed without state
    if (!orderDetails) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full bg-[#111] border border-[var(--color-accent)]/30 rounded-lg shadow-[0_0_30px_rgba(255,0,0,0.05)] p-8 md:p-12 text-center relative overflow-hidden">

                {/* Glow Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-50"></div>
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-[var(--color-accent)]/10 rounded-full blur-[80px]"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 mb-8 relative">
                        <div className="absolute inset-0 bg-[var(--color-accent)] rounded-full animate-ping opacity-20"></div>
                        <div className="relative bg-black rounded-full w-full h-full flex items-center justify-center border-2 border-[var(--color-accent)] text-[var(--color-accent)] shadow-[0_0_20px_rgba(255,0,0,0.3)]">
                            <CheckCircle size={48} className="drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]" />
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 leading-tight">
                        Order <br /><span className="text-[var(--color-accent)]">Confirmed</span>
                    </h1>

                    <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                        Thank you for your purchase. Your payment method (COD) has been accepted.
                    </p>

                    {/* Key Details Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10 text-left">
                        <div className="bg-black border border-gray-800 rounded p-4 flex items-center space-x-4">
                            <div className="bg-white/5 p-3 rounded-full text-gray-400">
                                <Package size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Order Number</p>
                                <p className="text-white font-bold">{orderDetails.orderNumber}</p>
                            </div>
                        </div>

                        <div className="bg-black border border-gray-800 rounded p-4 flex items-center space-x-4">
                            <div className="bg-white/5 p-3 rounded-full text-gray-400">
                                <ShoppingBag size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Total Amount</p>
                                <p className="text-[var(--color-accent)] font-bold">Rs. {Number(orderDetails.total).toLocaleString('en-PK')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-gray-500 mb-10 pb-10 border-b border-white/10 w-full">
                        A confirmation email has been sent to <span className="text-white font-medium">{orderDetails.email}</span>. We will notify you when your order ships.
                    </div>

                    <Link to="/products" className="btn-primary w-full md:w-auto md:px-12 py-4 uppercase tracking-wider text-sm font-bold shadow-[0_0_20px_rgba(0,255,255,0.2)]">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
