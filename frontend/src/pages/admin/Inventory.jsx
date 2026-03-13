import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, TrendingUp, ArrowUpDown, Package } from 'lucide-react';
import useProductStore from '../../store/productStore';

const Inventory = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        if (filterStatus === 'Low') return matchesSearch && p.totalStock <= 5 && p.totalStock > 0;
        if (filterStatus === 'Out') return matchesSearch && p.totalStock === 0;
        return matchesSearch;
    });

    const lowStockCount = products.filter(p => p.totalStock <= 5 && p.totalStock > 0).length;
    const outOfStockCount = products.filter(p => p.totalStock === 0).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">Inventory Control</h1>
                    <p className="text-gray-400 text-sm mt-1">Monitor and manage stock levels across all products</p>
                </div>

                <div className="flex w-full sm:w-auto space-x-4">
                    <div className="relative flex-grow sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by product name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-input pl-10 h-10"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#111] border border-white/5 p-4 flex items-center justify-between rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded"><Package size={20} /></div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total SKUs</span>
                    </div>
                    <span className="text-xl font-black text-white">{products.length}</span>
                </div>
                <button
                    onClick={() => setFilterStatus(filterStatus === 'Low' ? 'All' : 'Low')}
                    className={`bg-[#111] border p-4 flex items-center justify-between rounded-lg transition-all ${filterStatus === 'Low' ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-white/5 hover:border-white/10'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded"><AlertTriangle size={20} /></div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Low Stock (≤5)</span>
                    </div>
                    <span className="text-xl font-black text-yellow-500">{lowStockCount}</span>
                </button>
                <button
                    onClick={() => setFilterStatus(filterStatus === 'Out' ? 'All' : 'Out')}
                    className={`bg-[#111] border p-4 flex items-center justify-between rounded-lg transition-all ${filterStatus === 'Out' ? 'border-red-500/50 bg-red-500/5' : 'border-white/5 hover:border-white/10'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 text-red-500 rounded"><TrendingUp size={20} className="rotate-180" /></div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Out of Stock</span>
                    </div>
                    <span className="text-xl font-black text-red-500">{outOfStockCount}</span>
                </button>
            </div>

            {/* Inventory Table */}
            <div className="bg-[#111] border border-white/5 rounded-lg overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-black/50 text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                                <th className="px-6 py-4 font-bold">Product Item</th>
                                <th className="px-6 py-4 font-bold text-center">Variants</th>
                                <th className="px-6 py-4 font-bold text-center">Last Updated</th>
                                <th className="px-6 py-4 font-bold text-center">Availability</th>
                                <th className="px-6 py-4 font-bold text-right">Total Stock</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500 uppercase tracking-widest text-[10px]">Syncing Data...</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No matching products found.</td></tr>
                            ) : filteredProducts.map((p) => (
                                <tr key={p._id} className="hover:bg-white/5 transition-colors text-sm">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded border border-white/10" />
                                            <div>
                                                <p className="text-white font-bold uppercase tracking-tight line-clamp-1">{p.name}</p>
                                                <p className="text-[10px] text-gray-600 uppercase tracking-widest">{p.category?.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1 justify-center max-w-[200px] mx-auto">
                                            {p.variants?.map(v => (
                                                <div key={v.size} className={`text-[9px] px-1.5 py-0.5 rounded border ${v.stock <= 5 ? 'border-yellow-500/30 text-yellow-500' : 'border-white/10 text-gray-400'}`}>
                                                    {v.size}: {v.stock}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-500 text-xs">
                                        {new Date(p.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {p.totalStock === 0 ? (
                                            <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-1 rounded font-black uppercase tracking-wider">Out of Stock</span>
                                        ) : p.totalStock <= 10 ? (
                                            <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded font-black uppercase tracking-wider">Low Stock</span>
                                        ) : (
                                            <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded font-black uppercase tracking-wider">Healthy</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`text-lg font-black ${p.totalStock === 0 ? 'text-red-500' : p.totalStock <= 5 ? 'text-yellow-500' : 'text-white'}`}>
                                            {p.totalStock}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
