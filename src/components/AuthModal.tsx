import React, { useState } from 'react';
import { X, LogIn, UserPlus, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { LokaviLogo } from './LokaviLogo.js';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onLogin: (email: string, pass: string) => Promise<any>;
  onRegister: (email: string, pass: string, name: string, inst?: string) => Promise<any>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode: initialMode,
  onClose,
  onLogin,
  onRegister,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        await onLogin(email.trim(), password);
      } else {
        await onRegister(email.trim(), password, fullName.trim(), city.trim() || undefined);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (target: 'demoA' | 'demoB') => {
    setError(null);
    if (target === 'demoA') {
      setEmail('explorer@lokavi.in');
      setPassword('LokaviTravel2026!');
      setMode('login');
    } else {
      setEmail('wanderer.india@lokavi.in');
      setPassword('DiscoverLocal2026!');
      setFullName('Aarav Deshmukh');
      setCity('Pune, Maharashtra');
      setMode('register');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#29323A]/50 backdrop-blur-xs">
      <div className="bg-[#F7F4ED] rounded-3xl border border-[#DFCEB7] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E8EBE2] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LokaviLogo size="sm" showTagline={false} />
            <div>
              <h3 className="text-sm font-bold text-[#29323A]">
                {mode === 'login' ? 'Sign In to lokavi' : 'Create your lokavi Account'}
              </h3>
              <p className="text-xs text-[#53626F]">
                {mode === 'login' ? 'Access your saved trips and places' : 'Discover the local within India'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#53626F] hover:text-[#29323A] hover:bg-[#E8EBE2] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Demo Selector */}
        <div className="p-3.5 bg-[#E8EBE2]/60 border-b border-[#DFCEB7] text-xs flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#354D43] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C9A982]" /> Quick Demo Accounts:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('demoA')}
              className="flex-1 px-3 py-2 bg-white border border-[#DFCEB7] hover:border-[#354D43] text-[#29323A] rounded-xl text-[11px] font-medium text-left shadow-2xs transition-colors cursor-pointer"
            >
              <div className="font-bold truncate text-[#354D43]">Explorer Account</div>
              <div className="text-[10px] text-[#53626F] truncate">explorer@lokavi.in</div>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('demoB')}
              className="flex-1 px-3 py-2 bg-white border border-[#DFCEB7] hover:border-[#354D43] text-[#29323A] rounded-xl text-[11px] font-medium text-left shadow-2xs transition-colors cursor-pointer"
            >
              <div className="font-bold truncate text-[#354D43]">New Traveler</div>
              <div className="text-[10px] text-[#53626F] truncate">Quick Fill</div>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3 text-xs">
            {mode === 'register' && (
              <>
                <div>
                  <label className="font-semibold text-[#29323A] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aarav Deshmukh"
                    className="w-full bg-white border border-[#DFCEB7] rounded-xl px-3.5 py-2.5 text-xs text-[#29323A] placeholder-[#53626F]/60 focus:outline-hidden focus:border-[#354D43] focus:ring-2 focus:ring-[#354D43]/15 transition-all"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#29323A] block mb-1">Home City / State</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Pune, Maharashtra"
                    className="w-full bg-white border border-[#DFCEB7] rounded-xl px-3.5 py-2.5 text-xs text-[#29323A] placeholder-[#53626F]/60 focus:outline-hidden focus:border-[#354D43] focus:ring-2 focus:ring-[#354D43]/15 transition-all"
                  />
                </div>
              </>
            )}

            <div>
              <label className="font-semibold text-[#29323A] block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-white border border-[#DFCEB7] rounded-xl px-3.5 py-2.5 text-xs text-[#29323A] placeholder-[#53626F]/60 focus:outline-hidden focus:border-[#354D43] focus:ring-2 focus:ring-[#354D43]/15 transition-all"
              />
            </div>

            <div>
              <label className="font-semibold text-[#29323A] block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white border border-[#DFCEB7] rounded-xl px-3.5 py-2.5 text-xs text-[#29323A] placeholder-[#53626F]/60 focus:outline-hidden focus:border-[#354D43] focus:ring-2 focus:ring-[#354D43]/15 transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#354D43] hover:bg-[#24352E] disabled:opacity-40 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-3.5 h-3.5 text-[#C9A982]" />
                <span>Sign In to lokavi</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5 text-[#C9A982]" />
                <span>Create Account</span>
              </>
            )}
          </button>

          {/* Toggle Mode */}
          <div className="pt-2 text-center text-xs text-[#53626F]">
            {mode === 'login' ? (
              <p>
                New to lokavi?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(null); }}
                  className="font-semibold text-[#354D43] hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have a lokavi account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className="font-semibold text-[#354D43] hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};
