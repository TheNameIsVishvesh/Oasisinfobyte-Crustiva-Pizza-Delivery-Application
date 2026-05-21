import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name || !email || !password) {
      setError('Please provide all input fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitLoading(true);
    const result = await register(name, email, password);
    setIsSubmitLoading(false);

    if (result.success) {
      setSuccessMessage(result.message);
      // Clear inputs
      setName('');
      setEmail('');
      setPassword('');
    } else {
      setError(result.error);
    }
  };

  if (loading) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-pizza-dark text-white">
        <div class="w-12 h-12 border-4 border-pizza-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div class="min-h-[85vh] flex items-center justify-center px-6 py-12 bg-pizza-dark relative overflow-hidden">
      {/* Background Decorative Blur Gradients */}
      <div class="absolute -right-24 -top-24 w-96 h-96 bg-pizza-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute -left-24 -bottom-24 w-96 h-96 bg-pizza-accent/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="w-full max-w-md glass-dark p-8 rounded-[2rem] border border-white/5 shadow-premium text-white z-10">
        <div class="text-center space-y-2 mb-8">
          <h2 class="text-3xl font-extrabold tracking-tight">Create Account</h2>
          <p class="text-sm text-white/50">Join Crustiva to customize your hot gourmet crusts</p>
        </div>

        {/* Success Banner */}
        {successMessage ? (
          <div class="mb-6 p-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl space-y-4">
            <div class="flex items-start gap-3 text-xs leading-relaxed">
              <CheckCircle2 class="w-6 h-6 shrink-0 text-emerald-400" />
              <div>
                <span class="font-bold block text-sm">Verify Your Account</span>
                {successMessage}
              </div>
            </div>
            <div class="pt-3 border-t border-emerald-500/10 text-center">
              <Link to="/login" class="text-xs text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl font-semibold transition-all duration-300 inline-block">
                Go to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Error Alert Box */}
            {error && (
              <div class="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-start gap-3 text-xs leading-relaxed animate-shake">
                <AlertTriangle class="w-5 h-5 shrink-0 text-rose-400" />
                <div>
                  <span class="font-bold block">Registration Refused</span>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} class="space-y-5">
              {/* Full Name */}
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-white/70 tracking-wide uppercase">Full Name</label>
                <div class="relative">
                  <User class="w-5 h-5 absolute left-4 top-3.5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    class="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary focus:ring-1 focus:ring-pizza-primary outline-none transition-all duration-300 text-sm placeholder:text-white/20"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-white/70 tracking-wide uppercase">Email Address</label>
                <div class="relative">
                  <Mail class="w-5 h-5 absolute left-4 top-3.5 text-white/40" />
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    class="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary focus:ring-1 focus:ring-pizza-primary outline-none transition-all duration-300 text-sm placeholder:text-white/20"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-white/70 tracking-wide uppercase">Password</label>
                <div class="relative">
                  <Lock class="w-5 h-5 absolute left-4 top-3.5 text-white/40" />
                  <input
                    type="password"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    class="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary focus:ring-1 focus:ring-pizza-primary outline-none transition-all duration-300 text-sm placeholder:text-white/20"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitLoading}
                class="w-full py-3.5 bg-gradient-to-r from-pizza-primary to-pizza-secondary hover:shadow-glow text-white rounded-xl text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
              >
                {isSubmitLoading ? (
                  <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <UserPlus class="w-4 h-4" />
                    <span>Register Account</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}

        <div class="text-center mt-6 pt-6 border-t border-white/5 text-xs text-white/40">
          <p>
            Already have an account?{' '}
            <Link to="/login" class="text-pizza-primary font-bold hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
