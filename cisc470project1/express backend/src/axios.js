import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001',
    withCredentials: true,
});

// Add a request interceptor to add any necessary headers
api.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json';
    return config;
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
