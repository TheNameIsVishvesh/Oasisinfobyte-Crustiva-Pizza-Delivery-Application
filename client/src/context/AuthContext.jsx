import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [customerUser, setCustomerUser] = useState(null);
  const [customerToken, setCustomerToken] = useState(localStorage.getItem('slice_customer_token') || null);
  const [adminUser, setAdminUser] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('slice_admin_token') || null);
  const [loading, setLoading] = useState(true);

  // Synchronize profile details when JWT tokens are loaded
  const loadUser = async () => {
    try {
      const cToken = localStorage.getItem('slice_customer_token');
      const aToken = localStorage.getItem('slice_admin_token');

      if (cToken) {
        try {
          const res = await API.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${cToken}` }
          });
          setCustomerUser(res.data.user);
          setCustomerToken(cToken);
        } catch (err) {
          console.error('❌ Failed to restore customer session:', err.message);
          localStorage.removeItem('slice_customer_token');
          localStorage.removeItem('slice_customer_user');
          setCustomerToken(null);
          setCustomerUser(null);
        }
      }

      if (aToken) {
        try {
          const res = await API.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${aToken}` }
          });
          setAdminUser(res.data.user);
          setAdminToken(aToken);
        } catch (err) {
          console.error('❌ Failed to restore admin session:', err.message);
          localStorage.removeItem('slice_admin_token');
          localStorage.removeItem('slice_admin_user');
          setAdminToken(null);
          setAdminUser(null);
        }
      }
    } catch (err) {
      console.error('❌ Failed to restore session profile:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [customerToken, adminToken]);

  // Login Action
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/api/auth/login', { email, password });
      const { token: jwtToken, user: userProfile } = res.data;
      
      if (userProfile.role === 'admin') {
        localStorage.setItem('slice_admin_token', jwtToken);
        localStorage.setItem('slice_admin_user', JSON.stringify(userProfile));
        setAdminToken(jwtToken);
        setAdminUser(userProfile);
      } else {
        localStorage.setItem('slice_customer_token', jwtToken);
        localStorage.setItem('slice_customer_user', JSON.stringify(userProfile));
        setCustomerToken(jwtToken);
        setCustomerUser(userProfile);
      }
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Register Action
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/api/auth/register', { name, email, password });
      return { success: true, message: res.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Verify Email Action
  const verifyEmail = async (verificationToken) => {
    try {
      const res = await API.get(`/api/auth/verify/${verificationToken}`);
      return { success: true, message: res.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Verification link is invalid or has expired.';
      return { success: false, error: message };
    }
  };

  // Request Reset Token Action
  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const res = await API.post('/api/auth/forgot-password', { email });
      return { success: true, message: res.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit reset request.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Reset Password Action
  const resetPassword = async (resetToken, password) => {
    setLoading(true);
    try {
      const res = await API.post(`/api/auth/reset-password/${resetToken}`, { password });
      return { success: true, message: res.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reset password.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout Customer Session
  const logoutCustomer = () => {
    localStorage.removeItem('slice_customer_token');
    localStorage.removeItem('slice_customer_user');
    setCustomerToken(null);
    setCustomerUser(null);
  };

  // Logout Admin Session
  const logoutAdmin = () => {
    localStorage.removeItem('slice_admin_token');
    localStorage.removeItem('slice_admin_user');
    setAdminToken(null);
    setAdminUser(null);
  };

  // Generic Logout wrapper based on browser context and active sessions
  const logout = () => {
    if (window.location.pathname.startsWith('/admin')) {
      if (adminUser) {
        logoutAdmin();
      } else {
        logoutCustomer();
      }
    } else {
      if (customerUser) {
        logoutCustomer();
      } else {
        logoutAdmin();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        customerUser,
        customerToken,
        adminUser,
        adminToken,
        user: window.location.pathname.startsWith('/admin') ? (adminUser || customerUser) : (customerUser || adminUser),
        token: window.location.pathname.startsWith('/admin') ? (adminToken || customerToken) : (customerToken || adminToken),
        loading,
        isAuthenticated: !!customerUser,
        isAdmin: !!adminUser,
        login,
        register,
        verifyEmail,
        forgotPassword,
        resetPassword,
        logout,
        logoutCustomer,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
