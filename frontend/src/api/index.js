import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD ? 'https://cleaniq-soumya.onrender.com/api' : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cleaniq_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401, clear stored auth and redirect to login
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('cleaniq_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
