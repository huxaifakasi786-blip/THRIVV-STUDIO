import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingCart, Instagram, Facebook, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MobileMenu = ({ isOpen, onClose, navLinks, settings, cartItemCount, isActive }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] md:hidden">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Menu Content */}
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-[#0A0A0A] border-l border-white/5 flex flex-col p-8"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Navigation</span>
                            <button onClick={onClose} className="p-2 -mr-2 text-white/50 hover:text-white transition-colors">
                                <X size={24} strokeWidth={1.5} />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-6 mb-auto">
                            {navLinks.map((link, idx) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + idx * 0.05 }}
                                >
                                    <Link
                                        to={link.path}
                                        onClick={onClose}
                                        className={`text-3xl font-black uppercase tracking-tight transition-colors ${isActive(link.path) ? 'text-[var(--color-accent)]' : 'text-white hover:text-gray-400'}`}
                                        style={{ fontFamily: 'Oswald' }}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>

                        <div className="mt-8 pt-8 border-t border-white/5 space-y-8">
                            <Link 
                                to="/cart" 
                                onClick={onClose}
                                className="flex items-center justify-between w-full bg-white text-black px-6 py-4 font-black uppercase tracking-widest text-xs"
                            >
                                <div className="flex items-center gap-3">
                                    <ShoppingCart size={18} />
                                    <span>My Cart</span>
                                </div>
                                <span className="bg-black text-white px-2 py-0.5 text-[10px]">{cartItemCount}</span>
                            </Link>

                            <div className="flex items-center gap-6">
                                {settings?.socialLinks?.instagram && (
                                    <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                                        <Instagram size={20} />
                                    </a>
                                )}
                                {settings?.socialLinks?.facebook && (
                                    <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                                        <Facebook size={20} />
                                    </a>
                                )}
                                {settings?.socialLinks?.twitter && (
                                    <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                                        <Twitter size={20} />
                                    </a>
                                )}
                            </div>

                            <p className="text-[9px] text-gray-700 uppercase tracking-widest font-bold">
                                © {new Date().getFullYear()} THRIVV STUDIO · ALL RIGHTS RESERVED
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;
