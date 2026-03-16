import { create } from 'zustand';
import API from '../api/axios';

const useHomepageStore = create((set) => ({
    homepage: null,
    loading: false,
    error: null,

    fetchHomepage: async () => {
        set({ loading: true });
        try {
            const { data } = await API.get('/homepage');
            set({ homepage: data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch homepage', loading: false });
        }
    },

    updateHomepage: async (homepageData) => {
        set({ loading: true });
        try {
            const { data } = await API.put('/homepage', homepageData);
            set({ homepage: data, loading: false });
            return { success: true };
        } catch (error) {
            set({ loading: false });
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update homepage'
            };
        }
    }
}));

export default useHomepageStore;
