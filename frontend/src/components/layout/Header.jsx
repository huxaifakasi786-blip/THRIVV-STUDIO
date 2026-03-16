import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useProductStore from '../../store/productStore';
import useSettingsStore from '../../store/settingsStore';
import MobileMenu from './MobileMenu';

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

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 10);
            
            if (currentScrollY > 100) {
                if (currentScrollY > lastScrollY) {
                    setIsVisible(false); // Scrolling down
                } else {
                    setIsVisible(true); // Scrolling up
                }
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

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
                    &nbsp;&nbsp;&nbsp;FREE SHIPPING ON ORDERS OVER RS. {(settings?.freeShippingThreshold || 5000).toLocaleString()} &nbsp;•&nbsp; NEW DROP: VORTEX COLLECTION &nbsp;•&nbsp; COD AVAILABLE ACROSS PAKISTAN &nbsp;•&nbsp; FREE SHIPPING ON ORDERS OVER RS. {(settings?.freeShippingThreshold || 5000).toLocaleString()} &nbsp;•&nbsp; NEW DROP: VORTEX COLLECTION &nbsp;•&nbsp; COD AVAILABLE ACROSS PAKISTAN &nbsp;•&nbsp;
                </marquee>
            </div>

            {/* Main Header */}
            <header
                className={`fixed left-0 right-0 z-40 transition-all duration-500 ease-in-out ${
                    isVisible ? 'translate-y-0' : '-translate-y-full'
                } ${isScrolled
                    ? 'top-8 bg-black/95 backdrop-blur-md border-b border-white/5 shadow-2xl'
                    : 'top-8 bg-transparent border-b border-white/0'
                }`}
            >
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 group logo-container">
                            {settings?.logoUrl ? (
                                <img src={settings.logoUrl} alt="Logo" className="logo-img transition-transform duration-300 group-hover:scale-105" />
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

            {/* Mobile Menu Component */}
            <MobileMenu 
                isOpen={isMobileMenuOpen} 
                onClose={() => setIsMobileMenuOpen(false)} 
                navLinks={navLinks}
                settings={settings}
                cartItemCount={cartItemCount}
                isActive={isActive}
            />
        </>
    );
};

export default Header;
