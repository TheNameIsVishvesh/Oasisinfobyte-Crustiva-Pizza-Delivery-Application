import axios from 'axios';

// Create a global Axios instance
const API = axios.create({
  baseURL: '', // Empty base URL is routed through Vite dev server proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token into Authorization header automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('slice_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch expired or invalid token errors (401)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect user to login
      localStorage.removeItem('slice_token');
      localStorage.removeItem('slice_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
