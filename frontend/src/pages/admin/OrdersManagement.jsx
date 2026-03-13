import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter, X } from 'lucide-react';
import useAdminStore from '../../store/adminStore';

const OrdersManagement = () => {
    const { orders, fetchOrders, updateOrderStatus, loading } = useAdminStore();
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    const filteredOrders = orders.filter(order => {
        const matchesTab = activeTab === 'All' || order.status === activeTab;
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${order.customerDetail.firstName} ${order.customerDetail.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'text-green-500 bg-green-500/10';
            case 'Processing': return 'text-blue-500 bg-blue-500/10';
            case 'Shipped': return 'text-[var(--color-accent)] bg-[var(--color-accent)]/10';
            case 'Cancelled': return 'text-red-500 bg-red-500/10';
            default: return 'text-yellow-500 bg-yellow-500/10';
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const result = await updateOrderStatus(id, newStatus);
        if (!result.success) {
            alert(result.message);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">Orders</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage and track customer orders</p>
                </div>

                <div className="flex w-full sm:w-auto space-x-4">
                    <div className="relative flex-grow sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by ID or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black border border-gray-800 rounded pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === tab
                            ? 'bg-[var(--color-accent)] text-black'
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="bg-[#111] border border-white/5 rounded-lg overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-black/50 text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                                <th className="px-6 py-4 font-bold">Order ID</th>
                                <th className="px-6 py-4 font-bold">Customer</th>
                                <th className="px-6 py-4 font-bold text-center">Date</th>
                                <th className="px-6 py-4 font-bold text-center">Items</th>
                                <th className="px-6 py-4 font-bold text-right">Total</th>
                                <th className="px-6 py-4 font-bold text-center">Status</th>
                                <th className="px-6 py-4 font-bold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500 text-xs uppercase tracking-[0.2em]">Syncing Orders...</td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500">No orders found.</td>
                                </tr>
                            ) : filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-white/5 transition-colors text-sm">
                                    <td className="px-6 py-4 font-bold text-white">{order.orderNumber}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-white font-bold">{order.customerDetail.firstName} {order.customerDetail.lastName}</p>
                                        <p className="text-gray-500 text-xs">{order.customerDetail.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-center">{formatDate(order.createdAt)}</td>
                                    <td className="px-6 py-4 text-gray-300 text-center">{order.orderItems.length}</td>
                                    <td className="px-6 py-4 text-white font-medium text-right">Rs. {Number(order.totalAmount).toLocaleString('en-PK')}</td>
                                    <td className="px-6 py-4 text-center">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className={`appearance-none px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-center focus:outline-none cursor-pointer border-none ${getStatusColor(order.status)}`}
                                        >
                                            {tabs.filter(t => t !== 'All').map(status => (
                                                <option key={status} value={status} className="bg-[#111] text-white">
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleViewOrder(order)}
                                            className="text-[var(--color-accent)] hover:text-white transition-colors bg-[var(--color-accent)]/10 hover:bg-white/10 p-2 rounded inline-flex items-center space-x-1"
                                        >
                                            <Eye size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider hidden xl:inline">View</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-8">
                            <div className="flex justify-between items-start mb-8 pb-4 border-b border-white/5">
                                <div>
                                    <p className="text-[var(--color-accent)] text-[10px] font-black uppercase tracking-[0.3em] mb-1">Order Details</p>
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">{selectedOrder.orderNumber}</h2>
                                    <p className="text-gray-500 text-xs mt-1">{formatDate(selectedOrder.createdAt)}</p>
                                </div>
                                <div className={`px-4 py-1.5 rounded text-xs font-black uppercase tracking-widest ${getStatusColor(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h3 className="text-white text-xs font-black uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Customer</h3>
                                    <p className="text-white font-bold">{selectedOrder.customerDetail.firstName} {selectedOrder.customerDetail.lastName}</p>
                                    <p className="text-gray-400 text-sm mt-1">{selectedOrder.customerDetail.email}</p>
                                    <p className="text-gray-400 text-sm">{selectedOrder.customerDetail.phone}</p>
                                </div>
                                <div>
                                    <h3 className="text-white text-xs font-black uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Shipping Address</h3>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {selectedOrder.customerDetail.address}<br />
                                        {selectedOrder.customerDetail.city}, {selectedOrder.customerDetail.province}<br />
                                        {selectedOrder.customerDetail.zipCode}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-white text-xs font-black uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Order Items</h3>
                                <div className="space-y-4">
                                    {selectedOrder.orderItems.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-black/30 p-4 border border-white/5">
                                            <div>
                                                <p className="text-white font-bold uppercase text-xs">{item.name}</p>
                                                <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-0.5">Size: {item.size} | Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-white font-bold text-sm">Rs. {(item.price * item.quantity).toLocaleString('en-PK')}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-500 text-sm">Payment Method</span>
                                    <span className="text-white font-bold text-sm uppercase italic">{selectedOrder.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white font-black text-sm uppercase tracking-widest">Grand Total</span>
                                    <span className="text-2xl font-black text-[var(--color-accent)]">Rs. {Number(selectedOrder.totalAmount).toLocaleString('en-PK')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersManagement;
