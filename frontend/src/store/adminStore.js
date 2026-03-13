import { create } from 'zustand';
import API from '../api/axios';

const useAdminStore = create((set) => ({
    orders: [],
    loading: false,
    error: null,

    fetchOrders: async () => {
        set({ loading: true, error: null });
        try {
            const { data } = await API.get('/orders');
            set({ orders: data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch orders', loading: false });
        }
    },

    updateOrderStatus: async (id, status) => {
        try {
            const { data } = await API.put(`/orders/${id}/status`, { status });
            set((state) => ({
                orders: state.orders.map((o) => (o._id === id ? data : o))
            }));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update order status'
            };
        }
    }
}));

export default useAdminStore;
