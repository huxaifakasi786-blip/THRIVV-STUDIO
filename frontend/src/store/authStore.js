import { create } from 'zustand';
import API from '../api/axios';

const useAuthStore = create((set) => ({
    isAuthenticated: false,
    user: null,
    isLoading: true,

    login: async (username, password) => {
        try {
            const { data } = await API.post('/auth/login', { username, password });
            set({ isAuthenticated: true, user: data });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    },

    checkAuth: async () => {
        try {
            const { data } = await API.get('/auth/profile');
            set({ isAuthenticated: true, user: data, isLoading: false });
        } catch (error) {
            set({ isAuthenticated: false, user: null, isLoading: false });
        }
    },

    logout: async () => {
        try {
            await API.post('/auth/logout');
            set({ isAuthenticated: false, user: null });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }
}));

export default useAuthStore;
