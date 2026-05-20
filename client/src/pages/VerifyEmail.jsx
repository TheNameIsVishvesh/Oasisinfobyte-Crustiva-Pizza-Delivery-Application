import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ShieldAlert, Activity } from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  
  const { verifyEmail } = useAuth();

  useEffect(() => {
    const performVerification = async () => {
      if (!token) {
        setMessage('Missing activation token. Please verify the URL link from your verification email.');
        setLoading(false);
        return;
      }
      
      const res = await verifyEmail(token);
      setLoading(false);
      
      if (res.success) {
        setSuccess(true);
        setMessage(res.message);
      } else {
        setSuccess(false);
        setMessage(res.error);
      }
    };

    performVerification();
  }, [token, verifyEmail]);

  return (
    <div class="min-h-[80vh] flex items-center justify-center px-6 py-12 bg-pizza-dark text-white relative overflow-hidden">
      <div class="absolute -right-24 -top-24 w-96 h-96 bg-pizza-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute -left-24 -bottom-24 w-96 h-96 bg-pizza-accent/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="w-full max-w-md glass-dark p-8 rounded-[2rem] border border-white/5 shadow-premium text-center space-y-6 z-10">
        {loading ? (
          <div class="space-y-4 py-8">
            <Activity class="w-12 h-12 text-pizza-accent animate-spin mx-auto" />
            <h3 class="text-xl font-bold">Activating Account Profile...</h3>
            <p class="text-sm text-white/50">Verifying secure crypto signature from email token.</p>
          </div>
        ) : success ? (
          <div class="space-y-6 py-4">
            <div class="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-glow">
              <ShieldCheck class="w-8 h-8" />
            </div>
            <div class="space-y-2">
              <h3 class="text-2xl font-extrabold tracking-tight">Activation Successful!</h3>
              <p class="text-sm text-white/60 px-4">{message}</p>
            </div>
            <Link 
              to="/login?verified=true"
              class="inline-block px-8 py-3.5 bg-gradient-to-r from-pizza-primary to-pizza-secondary text-white font-bold rounded-xl text-sm hover:shadow-glow transition-all duration-300 w-full"
            >
              Continue to Log In
            </Link>
          </div>
        ) : (
          <div class="space-y-6 py-4">
            <div class="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert class="w-8 h-8" />
            </div>
            <div class="space-y-2">
              <h3 class="text-2xl font-extrabold tracking-tight text-rose-400">Verification Failure</h3>
              <p class="text-sm text-white/60 px-4">{message}</p>
            </div>
            <div class="space-y-3">
              <Link 
                to="/register"
                class="inline-block px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl text-sm transition-all duration-300 w-full"
              >
                Create a New Account
              </Link>
              <Link to="/login" class="block text-xs text-pizza-accent hover:underline">
                Back to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
