import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import Components
import Navbar from './components/Navbar';

// Import Public Pages
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Import Customer Protected Pages
import HomeDashboard from './pages/HomeDashboard';
import PizzaCustomizer from './pages/PizzaCustomizer';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';

// Import Admin Protected Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminInventory from './pages/admin/AdminInventory';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

// Guard: Customer Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pizza-dark text-white">
        <div className="w-12 h-12 border-4 border-pizza-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Guard: Admin-Only Protected Route
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pizza-dark text-white">
        <div className="w-12 h-12 border-4 border-pizza-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return isAuthenticated && isAdmin ? children : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <div className="min-h-screen bg-pizza-dark text-white font-sans flex flex-col">
      {/* Global Navigation Header */}
      <Navbar />

      {/* Primary Routes Layout */}
      <main className="flex-1">
        <Routes>
          {/* Public Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Customer public routes */}
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/customizer" element={<PizzaCustomizer />} />
          <Route path="/cart" element={<CartPage />} />
          
          {/* Customer Protected routes */}
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } 
          />

          {/* Admin Protected routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/inventory" 
            element={
              <AdminRoute>
                <AdminInventory />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            } 
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <footer className="bg-pizza-dark py-6 text-center text-xs text-white/20 border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} Crustiva Gourmet Pizzeria. Oasis Infobyte Level 3 Internship.</p>
      </footer>
    </div>
  );
}
