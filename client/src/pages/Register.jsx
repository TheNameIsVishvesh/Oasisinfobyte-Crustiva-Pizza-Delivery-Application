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
      <div className="min-h-screen flex items-center justify-center bg-pizza-dark text-white">
        <div className="w-12 h-12 border-4 border-pizza-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12 bg-pizza-dark relative overflow-hidden">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute -right-24 -top-24 w-96 h-96 bg-pizza-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-pizza-accent/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-dark p-8 rounded-[2rem] border border-white/5 shadow-premium text-white z-10">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">Create Account</h2>
          <p className="text-sm text-white/50">Join Crustiva to customize your hot gourmet crusts</p>
        </div>

        {/* Success Banner */}
        {successMessage ? (
          <div className="mb-6 p-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl space-y-4">
            <div className="flex items-start gap-3 text-xs leading-relaxed">
              <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
              <div>
                <span className="font-bold block text-sm">Verify Your Account</span>
                {successMessage}
              </div>
            </div>
            <div className="pt-3 border-t border-emerald-500/10 text-center">
              <Link to="/login" className="text-xs text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl font-semibold transition-all duration-300 inline-block">
                Go to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Error Alert Box */}
            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-start gap-3 text-xs leading-relaxed animate-shake">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
                <div>
                  <span className="font-bold block">Registration Refused</span>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70 tracking-wide uppercase">Full Name</label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-4 top-3.5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary focus:ring-1 focus:ring-pizza-primary outline-none transition-all duration-300 text-sm placeholder:text-white/20"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70 tracking-wide uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-4 top-3.5 text-white/40" />
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary focus:ring-1 focus:ring-pizza-primary outline-none transition-all duration-300 text-sm placeholder:text-white/20"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70 tracking-wide uppercase">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-4 top-3.5 text-white/40" />
                  <input
                    type="password"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary focus:ring-1 focus:ring-pizza-primary outline-none transition-all duration-300 text-sm placeholder:text-white/20"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitLoading}
                className="w-full py-3.5 bg-gradient-to-r from-pizza-primary to-pizza-secondary hover:shadow-glow text-white rounded-xl text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
              >
                {isSubmitLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Register Account</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}

        <div className="text-center mt-6 pt-6 border-t border-white/5 text-xs text-white/40">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-pizza-primary font-bold hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
