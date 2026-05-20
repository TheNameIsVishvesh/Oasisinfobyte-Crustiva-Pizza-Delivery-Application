import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('slice_token') || null);
  const [loading, setLoading] = useState(true);

  // Synchronize profile details when JWT token is loaded
  const loadUser = async () => {
    try {
      const res = await API.get('/api/auth/me');
      setUser(res.data.user);
    } catch (err) {
      console.error('❌ Failed to restore session profile:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Login Action
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/api/auth/login', { email, password });
      const { token: jwtToken, user: userProfile } = res.data;
      
      localStorage.setItem('slice_token', jwtToken);
      localStorage.setItem('slice_user', JSON.stringify(userProfile));
      
      setToken(jwtToken);
      setUser(userProfile);
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

  // Logout Action
  const logout = () => {
    localStorage.removeItem('slice_token');
    localStorage.removeItem('slice_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        verifyEmail,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
