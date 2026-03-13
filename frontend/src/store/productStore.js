import { create } from 'zustand';
import API from '../api/axios';

const useProductStore = create((set) => ({
    products: [],
    categories: [],
    loading: false,
    error: null,

    fetchProducts: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const { data } = await API.get('/products', { params: filters });
            set({ products: data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch products', loading: false });
        }
    },

    addProduct: async (productData) => {
        try {
            const { data } = await API.post('/products', productData);
            set((state) => ({
                products: [...state.products, data]
            }));
            return { success: true, product: data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to add product'
            };
        }
    },

    updateProduct: async (id, productData) => {
        try {
            const { data } = await API.put(`/products/${id}`, productData);
            set((state) => ({
                products: state.products.map((p) => (p._id === id ? data : p))
            }));
            return { success: true, product: data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update product'
            };
        }
    },

    deleteProduct: async (id) => {
        try {
            await API.delete(`/products/${id}`);
            set((state) => ({
                products: state.products.filter((p) => p._id !== id)
            }));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete product'
            };
        }
    },

    fetchCategories: async () => {
        try {
            const { data } = await API.get('/categories');
            set({ categories: data });
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    },

    addCategory: async (categoryData) => {
        try {
            const { data } = await API.post('/categories', categoryData);
            set((state) => ({
                categories: [...state.categories, data]
            }));
            return { success: true, category: data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to add category'
            };
        }
    },

    deleteCategory: async (id) => {
        try {
            await API.delete(`/categories/${id}`);
            set((state) => ({
                categories: state.categories.filter((c) => c._id !== id)
            }));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete category'
            };
        }
    },

    getProductById: async (id) => {
        try {
            const { data } = await API.get(`/products/${id}`);
            return data;
        } catch (error) {
            console.error('Failed to fetch product:', error);
            return null;
        }
    }
}));

export default useProductStore;
