import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
});

// Add auth token to all requests
api.interceptors.request.use(async (config) => {
    try {
        const token = await window.Clerk?.session?.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error getting auth token:', error);
    }
    return config;
});

export default api;