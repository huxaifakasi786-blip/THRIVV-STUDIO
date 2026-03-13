import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import useProductStore from '../../store/productStore';

const ProductsManagement = () => {
    const { products, fetchProducts, deleteProduct, loading } = useProductStore();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const result = await deleteProduct(id);
            if (!result.success) {
                alert(result.message);
            }
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">Products</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage your store's inventory</p>
                </div>

                <div className="flex w-full sm:w-auto space-x-4">
                    <div className="relative flex-grow sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black border border-gray-800 rounded pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm"
                        />
                    </div>
                    <Link to="/admin/products/add" className="btn-primary flex items-center space-x-2 py-2 px-4 shadow-none shrink-0 text-sm">
                        <Plus size={16} />
                        <span className="hidden sm:inline">Add Product</span>
                    </Link>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#111] border border-white/5 rounded-lg overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-black/50 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-bold w-20">Image</th>
                                <th className="px-6 py-4 font-bold">Product Name</th>
                                <th className="px-6 py-4 font-bold">Category</th>
                                <th className="px-6 py-4 font-bold text-center">Sizes</th>
                                <th className="px-6 py-4 font-bold text-right">Price</th>
                                <th className="px-6 py-4 font-bold text-center">Stock</th>
                                <th className="px-6 py-4 font-bold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500">Loading products...</td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500">No products found.</td>
                                </tr>
                            ) : filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-white/5 transition-colors group text-sm">
                                    <td className="px-6 py-3">
                                        <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded object-cover border border-gray-800" />
                                    </td>
                                    <td className="px-6 py-3">
                                        <p className="text-white font-bold truncate max-w-[250px]">{product.name}</p>
                                    </td>
                                    <td className="px-6 py-3 text-gray-400">
                                        {product.category?.name || 'Uncategorized'}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <div className="flex flex-wrap gap-1 justify-center">
                                            {product.variants?.map(v => (
                                                <span key={v.size} className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/20">{v.size}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-white font-medium text-right">
                                        Rs. {product.price.toLocaleString('en-PK')}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${product.totalStock > 10 ? 'bg-green-500/10 text-green-500' :
                                            product.totalStock > 0 ? 'bg-yellow-500/10 text-yellow-500' :
                                                'bg-red-500/10 text-red-500'
                                            }`}>
                                            {product.totalStock === 0 ? 'Out of Stock' : `${product.totalStock} in stock`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center justify-center space-x-3 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <Link to={`/admin/products/edit/${product._id}`} className="text-gray-400 hover:text-[var(--color-accent)] transition-colors tooltip" title="Edit">
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors tooltip" title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination placeholder */}
                <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                    <span>Showing 1 to 5 of 48 entries</span>
                    <div className="flex space-x-2">
                        <button className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded transition-colors disabled:opacity-50" disabled>Prev</button>
                        <button className="bg-[var(--color-accent)] text-black font-bold px-3 py-1 rounded transition-colors">1</button>
                        <button className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded transition-colors">2</button>
                        <button className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsManagement;
