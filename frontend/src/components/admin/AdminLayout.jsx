import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    FolderOpen,
    ShoppingCart,
    Image as ImageIcon,
    Settings,
    LogOut,
    Menu,
    X,
    AlertTriangle
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const AdminLayout = () => {
    const { isAuthenticated, logout, user, isLoading } = useAuthStore();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Don't redirect until auth check is complete
    if (isLoading) {
        return (
            <div className="h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-t-2 border-[var(--color-accent)] rounded-full animate-spin"></div>
            </div>
        );
    }

    // Protected Route Logic
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Categories', path: '/admin/categories', icon: FolderOpen },
        { name: 'Inventory', path: '/admin/inventory', icon: AlertTriangle },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
        { name: 'Logo Management', path: '/admin/logo', icon: ImageIcon },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-[#050505] overflow-hidden text-white font-sans">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-[#0A0A0A] border-r border-white/10 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                {/* Sidebar Header */}
                <div className="h-16 flex items-center px-6 border-b border-white/10 justify-between">
                    <span className="text-xl font-black tracking-tighter">
                        <span className="text-[var(--color-accent)]">ADMIN</span>PANEL
                    </span>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-bold'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={18} />
                                <span className="text-sm tracking-wide">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="text-sm tracking-wide">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 flex items-center justify-between border-b border-white/10 px-4 md:px-8 bg-[#0A0A0A]">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden text-gray-400 hover:text-white"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="hidden md:block">
                        {/* Breadcrumb or title could go here */}
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-white leading-none">{user?.name}</p>
                            <p className="text-xs text-[var(--color-accent)] mt-1 tracking-wider uppercase">Administrator</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-accent)] to-[var(--color-accentSecondary)] flex items-center justify-center font-bold text-black border-2 border-black shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-[#050505] p-4 md:p-8 custom-scrollbar relative">
                    <Outlet />
                </main>
            </div>

        </div>
    );
};

export default AdminLayout;
