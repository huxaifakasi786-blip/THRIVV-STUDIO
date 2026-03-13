import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">

            {/* Glitch Effect Background Text */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden select-none">
                <h1 className="text-[20vw] font-black loading-text">404</h1>
            </div>

            <div className="max-w-md w-full text-center relative z-10">
                <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 uppercase tracking-tighter mb-4">
                    404
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-accent)] uppercase tracking-widest mb-6 border-b border-white/10 pb-6 inline-block">
                    Page Not Found
                </h2>

                <p className="text-gray-400 text-lg mb-10 leading-relaxed uppercase tracking-wider text-sm font-medium">
                    The coordinates you entered lead to an empty void. This drop doesn't exist.
                </p>

                <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 justify-center">
                    <Link to="/" className="btn-primary flex-1 sm:flex-none">
                        Return to Base
                    </Link>
                    <Link to="/products" className="btn-outline border border-gray-700 hover:border-white text-white flex-1 sm:flex-none uppercase tracking-widest text-sm font-bold py-3 px-8 transition-colors">
                        View Collection
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
