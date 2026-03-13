import React, { useEffect } from 'react';
import { Package, ShoppingCart, DollarSign, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import useProductStore from '../../store/productStore';
import useAdminStore from '../../store/adminStore';

const Dashboard = () => {
    const { products, categories, fetchProducts, fetchCategories } = useProductStore();
    const { orders, fetchOrders, loading } = useAdminStore();

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchOrders();
    }, [fetchProducts, fetchCategories, fetchOrders]);

    // Calculate real stats
    const totalRevenue = orders.reduce((total, order) => total + (Number(order.totalAmount) || 0), 0);
    const recentOrders = orders.slice(0, 5);

    const stats = [
        { label: 'Total Products', value: products.length.toString(), icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Total Orders', value: orders.length.toString(), icon: ShoppingCart, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString('en-PK')}`, icon: DollarSign, color: 'text-[var(--color-accent)]', bg: 'bg-[var(--color-accent)]/10' },
        { label: 'Categories', value: categories.length.toString(), icon: FolderOpen, color: 'text-[var(--color-accentSecondary)]', bg: 'bg-[var(--color-accentSecondary)]/10' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'text-green-500 bg-green-500/10';
            case 'Processing': return 'text-blue-500 bg-blue-500/10';
            case 'Shipped': return 'text-[var(--color-accent)] bg-[var(--color-accent)]/10';
            case 'Cancelled': return 'text-red-500 bg-red-500/10';
            default: return 'text-yellow-500 bg-yellow-500/10';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">Dashboard Overview</h1>
                <div className="space-x-3 hidden sm:block">
                    <Link to="/admin/products" className="btn-primary text-xs py-2 px-4 shadow-none">Add Product</Link>
                    <Link to="/admin/orders" className="btn-outline text-xs py-2 px-4 border">View Orders</Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-[#111] border border-white/5 p-6 rounded-lg shadow-lg relative overflow-hidden group hover:border-white/20 transition-colors">
                            <div className="flex justify-between items-start z-10 relative">
                                <div>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-white tracking-tight">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            {/* Decorative glow on hover */}
                            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity ${stat.bg.replace('/10', '')}`}></div>
                        </div>
                    )
                })}
            </div>

            {/* Recent Orders Table */}
            <div className="bg-[#111] border border-white/5 rounded-lg overflow-hidden shadow-lg mt-8">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-lg font-bold uppercase tracking-wider text-white">Recent Orders</h2>
                    <Link to="/admin/orders" className="text-xs text-[var(--color-accent)] hover:text-white uppercase font-bold tracking-wider transition-colors">
                        View All
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/50 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-bold">Order ID</th>
                                <th className="px-6 py-4 font-bold">Customer</th>
                                <th className="px-6 py-4 font-bold">Total</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold hidden sm:table-cell">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-white/5 transition-colors cursor-pointer text-sm">
                                    <td className="px-6 py-4 font-bold text-white">{order.orderNumber}</td>
                                    <td className="px-6 py-4 text-gray-300">{order.customerDetail.firstName} {order.customerDetail.lastName}</td>
                                    <td className="px-6 py-4 text-white font-medium">Rs. {order.totalAmount.toLocaleString('en-PK')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{formatDate(order.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
