import { create } from 'zustand';
import API from '../api/axios';

// Simple mock store for demo
const useCartStore = create((set, get) => ({
    items: [],

    addItem: (item, quantity = 1) => set((state) => {
        // In a real app we'd check if the identical variant (same size/color) is already in cart
        return { items: [...state.items, { ...item, quantity: item.quantity || quantity, id: Date.now().toString() }] };
    }),

    removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id)
    })),

    updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i))
    })),

    clearCart: () => set({ items: [] }),

    getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    placeOrder: async (customerDetail, paymentMethod, finalTotalAmount) => {
        const { items, getCartTotal, clearCart } = get();
        try {
            const orderData = {
                customerDetail,
                orderItems: items.map(item => ({
                    product: item.productId,
                    name: item.name,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.price
                })),
                paymentMethod,
                totalAmount: finalTotalAmount || getCartTotal()
            };

            const { data } = await API.post('/orders', orderData);
            clearCart();
            return { success: true, order: data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to place order'
            };
        }
    }
}));

export default useCartStore;
