import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, ShieldCheck } from 'lucide-react';
import useSettingsStore from '../../store/settingsStore';
import useProductStore from '../../store/productStore';
import { useEffect } from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { settings, fetchSettings } = useSettingsStore();
    const { categories, fetchCategories } = useProductStore();

    useEffect(() => {
        fetchSettings();
        fetchCategories();
    }, [fetchSettings, fetchCategories]);

    const footerLinks = {
        'Shop': [
            { name: 'All Products', path: '/products' },
            ...categories.slice(0, 8).map(cat => ({
                name: cat.name,
                path: `/products?category=${cat._id}`
            }))
        ],
        'Info': [
            { name: 'Shipping Policy', path: '/shipping-policy' },
            { name: 'Return Policy', path: '/return-policy' },
            { name: 'Privacy Policy', path: '/privacy-policy' },
            { name: 'Terms of Service', path: '/terms-of-service' },
        ],
    };

    return (
        <footer className="bg-black border-t border-white/5 pt-16 pb-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-2">
                        <Link to="/">
                            {settings?.logoUrl ? (
                                <img src={settings.logoUrl} alt="Logo" className="h-10 w-auto object-contain mb-4" />
                            ) : (
                                <h2
                                    className="text-4xl font-black text-white tracking-tighter mb-4"
                                    style={{ fontFamily: 'Oswald, sans-serif' }}
                                >
                                    THRIVV<span className="text-[var(--color-accent)]">»</span>STUDIO
                                </h2>
                            )}
                        </Link>
                        <p className="text-gray-600 text-xs leading-relaxed max-w-xs tracking-wide">
                            Premium streetwear for the bold and relentless. Pakistani-made. Globally inspired.
                        </p>
                        <div className="flex gap-4 mt-6">
                            {settings?.socialLinks?.instagram && (
                                <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-white transition-colors" aria-label="Instagram">
                                    <Instagram size={16} />
                                </a>
                            )}
                            {settings?.socialLinks?.facebook && (
                                <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-white transition-colors" aria-label="Facebook">
                                    <Facebook size={16} />
                                </a>
                            )}
                            {settings?.socialLinks?.youtube && (
                                <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-white transition-colors" aria-label="YouTube">
                                    <Youtube size={16} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Footer Links */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="text-white text-[10px] font-black uppercase tracking-[0.35em] mb-5">{title}</h3>
                            <ul className="space-y-3">
                                {links.map(link => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-gray-600 hover:text-white text-xs uppercase tracking-widest transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* 3D POWERED BY KASI Section */}
                <div className="border-t border-white/5 pt-12 pb-4 text-center">
                    <p className="text-gray-700 text-[9px] uppercase tracking-[0.4em] mb-3">Website crafted by</p>
                    <div className="inline-block">
                        <span className="kasi-credit">
                            POWERED BY KASI DEVELOPER
                        </span>
                    </div>
                </div>

                {/* Bottom Bar - Admin link */}
                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                    <p className="text-gray-700 text-[9px] uppercase tracking-[0.3em]">
                        © {currentYear} THRIVV STUDIO. ALL RIGHTS RESERVED.
                    </p>
                    <Link
                        to="/admin/login"
                        className="text-gray-600 hover:text-[var(--color-accent)] text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-2"
                    >
                        <ShieldCheck size={12} className="opacity-50" />
                        Admin Access
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
