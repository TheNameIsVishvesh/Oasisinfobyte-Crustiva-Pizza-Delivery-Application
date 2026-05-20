import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, ShieldAlert, Sparkles, History, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = getCartItemCount();

  return (
    <nav class="bg-pizza-dark/80 backdrop-blur-md border-b border-white/5 py-4 px-6 sticky top-0 z-50 transition-all">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" class="flex items-center gap-2 group">
          <div class="w-10 h-10 bg-pizza-primary/10 border border-pizza-primary/20 rounded-xl flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
            <span class="text-xl group-hover:rotate-12 transition-transform">🍕</span>
          </div>
          <span class="font-black text-xl tracking-tight text-white group-hover:text-pizza-primary transition-colors">
            Slice<span class="text-pizza-accent">Life</span>
          </span>
        </Link>

        {/* Navigation Action Links */}
        <div class="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              {/* User Home Catalog */}
              <Link to="/" class="text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white transition-colors hidden sm:block">
                Menu Catalog
              </Link>

              {/* Order History */}
              <Link to="/orders" class="text-white/70 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                <History class="w-4 h-4 text-pizza-accent" />
                <span class="hidden md:block">Track Orders</span>
              </Link>

              {/* Admin Panel Link */}
              {isAdmin && (
                <Link to="/admin" class="text-pizza-primary hover:text-pizza-primary/80 transition-colors flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider">
                  <ShieldAlert class="w-4 h-4" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* Shopping Cart Trigger */}
              <Link to="/cart" class="relative text-white/70 hover:text-white transition-colors p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10">
                <ShoppingCart class="w-4.5 h-4.5" />
                {cartCount > 0 && (
                  <span class="absolute -top-1.5 -right-1.5 bg-pizza-primary text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-glow animate-bounce">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Profile Info & Logout */}
              <div class="flex items-center gap-3 pl-4 border-l border-white/10">
                <div class="text-right hidden lg:block">
                  <span class="text-[10px] text-white/40 block font-semibold uppercase">Logged in</span>
                  <span class="text-xs font-bold text-white/80 flex items-center gap-1">
                    <User class="w-3.5 h-3.5 text-pizza-accent" />
                    <span>{user?.name}</span>
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  class="p-2 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                  title="Logout Session"
                >
                  <LogOut class="w-4.5 h-4.5" />
                </button>
              </div>
            </>
          ) : (
            <div class="flex items-center gap-3">
              <Link to="/login" class="text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white transition-colors">
                Log In
              </Link>
              <Link to="/register" class="px-4 py-2 bg-pizza-primary hover:shadow-glow text-white text-xs font-bold rounded-xl transition-all uppercase tracking-wider">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
