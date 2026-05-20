import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Mail, AlertTriangle, CheckCircle2, ChevronLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please provide your email address.');
      return;
    }

    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (result.success) {
      setSuccess(result.message);
      setEmail('');
    } else {
      setError(result.error);
    }
  };

  return (
    <div class="min-h-[85vh] flex items-center justify-center px-6 py-12 bg-pizza-dark relative overflow-hidden text-white">
      <div class="absolute -right-24 -top-24 w-96 h-96 bg-pizza-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute -left-24 -bottom-24 w-96 h-96 bg-pizza-accent/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="w-full max-w-md glass-dark p-8 rounded-[2rem] border border-white/5 shadow-premium z-10 space-y-6">
        <div class="text-center space-y-2">
          <div class="w-12 h-12 bg-pizza-primary/10 border border-pizza-primary/20 text-pizza-primary rounded-2xl flex items-center justify-center mx-auto mb-2">
            <KeyRound class="w-6 h-6" />
          </div>
          <h2 class="text-3xl font-extrabold tracking-tight">Recover Password</h2>
          <p class="text-xs text-white/50 px-4">Enter your email and we'll dispatch a secure recovery activation token link.</p>
        </div>

        {success ? (
          <div class="p-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-start gap-3 text-xs leading-relaxed">
            <CheckCircle2 class="w-6 h-6 shrink-0 text-emerald-400" />
            <div>
              <span class="font-bold block text-sm">Dispatched Email!</span>
              {success}
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div class="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-start gap-3 text-xs leading-relaxed animate-shake">
                <AlertTriangle class="w-5 h-5 shrink-0 text-rose-400" />
                <div>
                  <span class="font-bold block">Submission Error</span>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} class="space-y-4">
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

              <button
                type="submit"
                disabled={loading}
                class="w-full py-3.5 bg-gradient-to-r from-pizza-primary to-pizza-secondary hover:shadow-glow text-white font-bold rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Send Recovery Link</span>
                )}
              </button>
            </form>
          </>
        )}

        <div class="text-center pt-2">
          <Link to="/login" class="inline-flex items-center gap-1.5 text-xs text-pizza-accent hover:text-pizza-primary transition-colors">
            <ChevronLeft class="w-4 h-4" />
            <span>Return to Log In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
