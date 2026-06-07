import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Invalid password recovery request. Recovery token is missing.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await resetPassword(token, password);
    setLoading(false);

    if (result.success) {
      setSuccess(result.message);
      setPassword('');
      setConfirmPassword('');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12 bg-pizza-dark relative overflow-hidden text-white">
      <div className="absolute -right-24 -top-24 w-96 h-96 bg-pizza-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-pizza-accent/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-dark p-8 rounded-[2rem] border border-white/5 shadow-premium z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-pizza-primary/10 border border-pizza-primary/20 text-pizza-primary rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Set New Password</h2>
          <p className="text-xs text-white/50 px-4">Enter a strong password configuration below.</p>
        </div>

        {success ? (
          <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl space-y-4">
            <div className="flex items-start gap-3 text-xs leading-relaxed">
              <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
              <div>
                <span className="font-bold block text-sm">Password Reset!</span>
                {success}
              </div>
            </div>
            <div className="pt-3 border-t border-emerald-500/10 text-center">
              <Link to="/login" className="inline-block text-xs bg-emerald-500 hover:bg-emerald-600 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 w-full">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-start gap-3 text-xs leading-relaxed animate-shake">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
                <div>
                  <span className="font-bold block">Update Refused</span>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70 tracking-wide uppercase">New Password</label>
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

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70 tracking-wide uppercase">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-4 top-3.5 text-white/40" />
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary focus:ring-1 focus:ring-pizza-primary outline-none transition-all duration-300 text-sm placeholder:text-white/20"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-pizza-primary to-pizza-secondary hover:shadow-glow text-white font-bold rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
