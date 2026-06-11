import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, LayoutDashboard, Sparkles, History, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const cartCount = getCartItemCount();
  const currentPath = location.pathname;

  return (
    <header className="sticky top-0 z-50 px-4 py-4 md:px-8 bg-pizza-dark/60 backdrop-blur-xl border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-[#1A120F]/80 p-3 px-6 rounded-2xl border border-white/5 shadow-premium">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div 
            whileHover={{ scale: 1.08, rotate: 12 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="w-10 h-10 bg-gradient-to-tr from-pizza-primary to-pizza-gold rounded-xl flex items-center justify-center shadow-glow"
          >
            <span className="text-xl">🍕</span>
          </motion.div>
          <span className="font-black text-2xl tracking-tight text-white font-sans">
            CRUST<span className="text-pizza-primary">IVA</span>
          </span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-5">
          {/* Menu Catalog */}
          <Link 
            to="/" 
            className={`text-xs font-bold uppercase tracking-wider transition-all duration-300 relative py-1 hidden sm:block ${
              currentPath === '/' ? 'text-pizza-primary' : 'text-pizza-gray hover:text-white'
            }`}
          >
            Catalog
            {currentPath === '/' && (
              <motion.div 
                layoutId="nav-underline" 
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-pizza-primary rounded-full shadow-glow"
              />
            )}
          </Link>

          {isAuthenticated || isAdmin ? (
            <>
              {/* Order History */}
              {isAuthenticated && (
                <Link 
                  to="/orders" 
                  className={`text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 py-1 ${
                    currentPath === '/orders' ? 'text-pizza-primary' : 'text-pizza-gray hover:text-white'
                  }`}
                >
                  <History className="w-4 h-4 text-pizza-gold" />
                  <span className="hidden md:inline">Track Orders</span>
                  {currentPath === '/orders' && (
                    <motion.div 
                      layoutId="nav-underline" 
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-pizza-primary rounded-full shadow-glow"
                    />
                  )}
                </Link>
              )}

              {/* Admin Panel Link */}
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className={`text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 py-1 ${
                    currentPath.startsWith('/admin') ? 'text-pizza-primary' : 'text-pizza-primary/80 hover:text-pizza-primary'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-pizza-primary" />
                  <span>Admin</span>
                  {currentPath.startsWith('/admin') && (
                    <motion.div 
                      layoutId="nav-underline" 
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-pizza-primary rounded-full shadow-glow"
                    />
                  )}
                </Link>
              )}

              {/* Shopping Cart Link */}
              {isAuthenticated && (
                <Link 
                  to="/cart" 
                  className={`relative p-2.5 bg-pizza-charcoal rounded-xl border border-white/10 hover:border-pizza-primary/30 transition-all duration-300 ${
                    currentPath === '/cart' ? 'bg-pizza-primary/10 border-pizza-primary' : ''
                  }`}
                >
                  <ShoppingCart className="w-4.5 h-4.5 text-white/90" />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1.5 -right-1.5 bg-pizza-primary text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-glow"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )}

              {/* User Dropdown */}
              <div className="relative pl-4 border-l border-white/10">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-left hover:opacity-90 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-full bg-pizza-primary/10 border border-pizza-primary/30 flex items-center justify-center text-pizza-primary font-bold text-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden lg:block text-xs">
                    <span className="block text-[9px] text-pizza-subtle uppercase font-semibold">
                      {currentPath.startsWith('/admin') ? 'Admin' : 'User'}
                    </span>
                    <span className="font-bold text-pizza-light flex items-center gap-0.5">
                      {user?.name}
                      <ChevronDown className="w-3 h-3 text-pizza-gold" />
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      {/* Backdrop to close */}
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-48 bg-pizza-espresso border border-white/10 rounded-xl shadow-premium overflow-hidden z-20 py-1"
                      >
                        <div className="px-4 py-2 border-b border-white/5">
                          <p className="text-xs text-pizza-gray font-bold truncate">{user?.name}</p>
                          <p className="text-[10px] text-pizza-subtle truncate">{user?.email}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors font-bold"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout {currentPath.startsWith('/admin') ? 'Admin' : ''}</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="text-xs font-bold uppercase tracking-wider text-pizza-gray hover:text-white transition-colors px-3 py-2"
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-gradient-to-r from-pizza-primary to-pizza-secondary hover:shadow-glow text-white text-xs font-black rounded-xl transition-all uppercase tracking-wider"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
