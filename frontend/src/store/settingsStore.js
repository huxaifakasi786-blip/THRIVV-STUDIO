import { create } from 'zustand';
import API from '../api/axios';

const useSettingsStore = create((set) => ({
    settings: null,
    loading: false,
    error: null,

    fetchSettings: async () => {
        set({ loading: true });
        try {
            const { data } = await API.get('/settings');
            set({ settings: data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch settings', loading: false });
        }
    },

    updateSettings: async (settingsData) => {
        set({ loading: true });
        try {
            const { data } = await API.put('/settings', settingsData);
            set({ settings: data, loading: false });
            return { success: true };
        } catch (error) {
            set({ loading: false });
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update settings'
            };
        }
    }
}));

export default useSettingsStore;
