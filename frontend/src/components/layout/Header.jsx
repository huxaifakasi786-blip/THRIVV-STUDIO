import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useProductStore from '../../store/productStore';
import useSettingsStore from '../../store/settingsStore';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { items: cartItems } = useCartStore();
    const { categories, fetchCategories } = useProductStore();
    const { settings, fetchSettings } = useSettingsStore();
    const cartItemCount = cartItems?.length || 0;

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { name: 'HOME', path: '/' },
        { name: 'SHOP', path: '/products' },
        ...categories.slice(0, 8).map(cat => ({
            name: cat.name.toUpperCase(),
            path: `/products?category=${cat._id}`
        }))
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path.split('?')[0]) && path.split('?')[0] !== '/';
    };

    return (
        <>
            {/* Announcement Bar */}
            <div className="announcement-bar fixed top-0 left-0 right-0 z-50">
                <marquee behavior="scroll" direction="left" scrollamount="4">
                    &nbsp;&nbsp;&nbsp;FREE SHIPPING ON ORDERS OVER RS. 5,000 &nbsp;•&nbsp; NEW DROP: VORTEX COLLECTION &nbsp;•&nbsp; COD AVAILABLE ACROSS PAKISTAN &nbsp;•&nbsp; FREE SHIPPING ON ORDERS OVER RS. 5,000 &nbsp;•&nbsp; NEW DROP: VORTEX COLLECTION &nbsp;•&nbsp; COD AVAILABLE ACROSS PAKISTAN &nbsp;•&nbsp;
                </marquee>
            </div>

            {/* Main Header */}
            <header
                className={`fixed left-0 right-0 z-40 transition-all duration-300 ${isScrolled
                    ? 'top-8 bg-black/95 backdrop-blur-md border-b border-white/5'
                    : 'top-8 bg-transparent border-b border-white/0'
                    }`}
            >
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 group">
                            {settings?.logoUrl ? (
                                <img src={settings.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
                            ) : (
                                <div className="flex items-baseline gap-0.5">
                                    <span
                                        className="text-white font-black text-2xl tracking-tighter transition-all"
                                        style={{ fontFamily: 'Oswald, sans-serif', letterSpacing: '-0.02em' }}
                                    >
                                        THRIVV
                                    </span>
                                    <span
                                        className="text-[var(--color-accent)] font-black text-2xl tracking-tighter"
                                        style={{ fontFamily: 'Oswald, sans-serif' }}
                                    >
                                        »
                                    </span>
                                    <span
                                        className="text-gray-400 font-medium text-sm ml-1 tracking-widest uppercase"
                                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                    >
                                        STUDIO
                                    </span>
                                </div>
                            )}
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-[11px] font-bold tracking-[0.25em] uppercase transition-colors relative group py-1 ${isActive(link.path) ? 'text-white' : 'text-gray-500 hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                    <span className={`absolute bottom-0 left-0 h-px bg-white transition-all duration-300 ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                </Link>
                            ))}
                        </nav>

                        {/* Right Icons */}
                        <div className="flex items-center gap-5">
                            {/* Cart */}
                            <Link to="/cart" className="relative text-gray-300 hover:text-white transition-colors group" id="header-cart-btn">
                                <ShoppingCart size={20} strokeWidth={1.5} />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[var(--color-accent)] text-black text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center leading-none">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button
                                className="md:hidden text-gray-300 hover:text-white transition-colors"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                id="mobile-menu-toggle"
                            >
                                {isMobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-x-0 z-30 md:hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-10 opacity-0 invisible'}`}
                style={{ top: isScrolled ? '104px' : '104px', maxHeight: 'calc(100vh - 104px)', overflowY: 'auto' }}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)}></div>

                {/* Menu Content */}
                <div className="relative bg-black/50 border-t border-white/5 px-6 py-10">
                    <nav className="flex flex-col gap-4">
                        {navLinks.map((link, idx) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-4xl font-black uppercase tracking-tight transition-all duration-300 ${isActive(link.path) ? 'text-[var(--color-accent)]' : 'text-white hover:text-gray-400'
                                    }`}
                                style={{
                                    fontFamily: 'Oswald, sans-serif',
                                    transitionDelay: `${idx * 50}ms`,
                                    transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)'
                                }}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-6">
                        <Link to="/cart" className="text-gray-400 hover:text-white text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                            <ShoppingCart size={16} />
                            Cart ({cartItemCount})
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
