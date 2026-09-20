'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { X, Mail, Lock, User, LogIn, UserPlus, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'signin' }) => {
  const [tab, setTab] = useState<'signin' | 'signup'>(defaultTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { loginWithGoogle, loginWithEmail, signupWithEmail, loginAnonymously } = useAuth();

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError(null);
    setSuccessMsg(null);
  };

  const handleSwitchTab = (newTab: 'signin' | 'signup') => {
    setTab(newTab);
    setError(null);
    setSuccessMsg(null);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await loginAnonymously();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in as guest.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (tab === 'signup' && !name) {
      setError('Please enter your full name.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      if (tab === 'signup') {
        await signupWithEmail(name, email, password);
        setSuccessMsg('Account created successfully!');
      } else {
        await loginWithEmail(email, password);
        setSuccessMsg('Signed in successfully!');
      }
      setTimeout(() => {
        onClose();
        resetForm();
      }, 600);
    } catch (err: any) {
      let msg = err?.message || 'Authentication failed.';
      if (msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found') || msg.includes('invalid-credential')) {
        msg = 'Invalid email or password.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'An account with this email already exists.';
      } else if (msg.includes('auth/weak-password')) {
        msg = 'Password should be at least 6 characters.';
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      {/* Modal Card Container */}
      <div 
        className="relative w-full max-w-md rounded-2xl bg-[#16181f] border border-[#2e3442] shadow-2xl overflow-hidden p-6 sm:p-8 text-white transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent header line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/0 via-amber-400 to-amber-500/0" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-[#20232b] transition-colors"
          aria-label="Close auth modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Charan AI Account</h2>
          <p className="text-sm text-gray-400 mt-1">Sign in to save chat history & custom preferences</p>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#20242e] border border-[#2e3442] hover:bg-[#282d3a] text-white font-medium text-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-50 mb-4 shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-5">
          <div className="border-t border-[#2a2f3d] w-full" />
          <span className="bg-[#16181f] px-3 text-xs uppercase text-gray-500 tracking-wider">or email</span>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#0d0f14] rounded-xl mb-5 border border-[#232733]">
          <button
            type="button"
            onClick={() => handleSwitchTab('signin')}
            className={`py-2 text-sm font-medium rounded-lg transition-all ${
              tab === 'signin'
                ? 'bg-[#20242e] text-amber-400 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleSwitchTab('signup')}
            className={`py-2 text-sm font-medium rounded-lg transition-all ${
              tab === 'signup'
                ? 'bg-[#20242e] text-amber-400 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500" />
                <input
                  type="text"
                  required
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e1015] border border-[#2a2f3d] text-white text-sm focus:outline-none focus:border-amber-400/80 transition-all placeholder:text-gray-400"
                />

              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e1015] border border-[#2a2f3d] text-white text-sm focus:outline-none focus:border-amber-400/80 transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e1015] border border-[#2a2f3d] text-white text-sm focus:outline-none focus:border-amber-400/80 transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-all duration-200 shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : tab === 'signin' ? (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Guest fallback option */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={handleGuestSignIn}
            className="text-xs text-gray-400 hover:text-amber-400 transition-colors underline underline-offset-4"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
