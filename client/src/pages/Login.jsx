import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  
  const { login, isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Display warning prompts (like expired tokens) from URL query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired')) {
      setError('Your session has expired. Please log in again.');
    }
    if (params.get('verified')) {
      setError('');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all input fields.');
      return;
    }

    setIsSubmitLoading(true);
    const result = await login(email, password);
    setIsSubmitLoading(false);

    if (!result.success) {
      setError(result.error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pizza-dark text-white">
        <div className="w-12 h-12 border-4 border-pizza-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isVerifiedQuery = new URLSearchParams(location.search).get('verified');

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12 bg-pizza-dark relative overflow-hidden">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute -right-24 -top-24 w-96 h-96 bg-pizza-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-pizza-accent/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-dark p-8 rounded-[2rem] border border-white/5 shadow-premium text-white z-10">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">Welcome Back</h2>
          <p className="text-sm text-white/50">Enter credentials to order gourmet pizzas</p>
        </div>

        {/* Verification Alert Banner */}
        {isVerifiedQuery && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-start gap-3 text-xs leading-relaxed">
            <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
            <div>
              <span className="font-bold block">Account Activated!</span>
              Your email has been verified. You may now log in below.
            </div>
          </div>
        )}

        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-start gap-3 text-xs leading-relaxed animate-shake">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
            <div>
              <span className="font-bold block">Access Denied</span>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70 tracking-wide uppercase">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-4 top-3.5 text-white/40" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary focus:ring-1 focus:ring-pizza-primary outline-none transition-all duration-300 text-sm placeholder:text-white/20"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-white/70 tracking-wide uppercase">Password</label>
              <Link to="/forgot-password" className="text-xs text-pizza-accent hover:text-pizza-primary transition-colors">Forgot Password?</Link>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-4 top-3.5 text-white/40" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary focus:ring-1 focus:ring-pizza-primary outline-none transition-all duration-300 text-sm placeholder:text-white/20"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitLoading}
            className="w-full py-3.5 bg-gradient-to-r from-pizza-primary to-pizza-secondary hover:shadow-glow text-white rounded-xl text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
          >
            {isSubmitLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Log In Securely</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-white/5 text-xs text-white/40 space-y-4">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-pizza-primary font-bold hover:underline">Create Account</Link>
          </p>
          <div className="bg-[#0F0B0A] p-3.5 rounded-xl border border-white/5 text-left text-[11px] leading-relaxed space-y-2">
            <div className="flex gap-2">
              <HelpCircle className="w-4 h-4 shrink-0 text-pizza-gold" />
              <span className="font-bold text-white/70 block uppercase tracking-wider text-[9px]">Developer Demo Logins</span>
            </div>
            <div className="space-y-1 text-white/60">
              <p>🟢 <strong className="text-pizza-light">Customer:</strong> <code className="text-pizza-primary font-mono">user@crustiva.com</code> / <code className="text-pizza-primary font-mono">userpassword123</code></p>
              <p>👑 <strong className="text-pizza-light">Admin:</strong> <code className="text-pizza-primary font-mono">admin@crustiva.com</code> / <code className="text-pizza-primary font-mono">adminpassword123</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
