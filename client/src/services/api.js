import axios from 'axios';

// Resolve the API URL from environment variables, falling back to Vite dev server proxy in development
const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL;
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

// Create a global Axios instance
const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject correct JWT token based on routing context
API.interceptors.request.use(
  (config) => {
    // If the request explicitly has an Authorization header, respect it
    if (config.headers.Authorization) {
      return config;
    }

    const isAdminPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
    const token = isAdminPage
      ? localStorage.getItem('slice_admin_token')
      : localStorage.getItem('slice_customer_token');

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
      const authHeader = error.config?.headers?.Authorization || '';
      const tokenSent = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';
      
      const customerToken = localStorage.getItem('slice_customer_token');
      const adminToken = localStorage.getItem('slice_admin_token');

      if (tokenSent && tokenSent === adminToken) {
        localStorage.removeItem('slice_admin_token');
        localStorage.removeItem('slice_admin_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true&role=admin';
        }
      } else if (tokenSent && tokenSent === customerToken) {
        localStorage.removeItem('slice_customer_token');
        localStorage.removeItem('slice_customer_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true&role=customer';
        }
      } else {
        // Fallback page-based check
        const isAdminPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
        if (isAdminPage) {
          localStorage.removeItem('slice_admin_token');
          localStorage.removeItem('slice_admin_user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login?expired=true&role=admin';
          }
        } else {
          localStorage.removeItem('slice_customer_token');
          localStorage.removeItem('slice_customer_user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login?expired=true&role=customer';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
