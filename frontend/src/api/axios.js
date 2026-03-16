import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response interceptor for handling errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors like 401 Unauthorized
        if (error.response?.status === 401) {
            // Silently handle profile checks to avoid console noise when not logged in
            if (!error.config.url.includes('/api/auth/profile')) {
                console.warn('Unauthorized access - potential session expiry');
            }
        }
        return Promise.reject(error);
    }
);

export default API;
