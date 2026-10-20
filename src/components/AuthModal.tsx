'use client';

// ==============================================================================
// PALATE: Cloud Authentication & Sync Modal
// Enables cross-device sync for votes, food passport level, dining check-ins,
// and receipt proof via Supabase Auth.
// ==============================================================================

import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Sparkles, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithMagicLink,
  signOutUser,
  isSupabaseConfigured,
} from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAuthSuccess: (user: User | null) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'magiclink'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'magiclink') {
        await signInWithMagicLink(email.trim());
        setMessage({
          type: 'success',
          text: '✨ Magic login link sent to your email! Click it to sign in instantly.',
        });
        setLoading(false);
        return;
      }

      if (mode === 'signup') {
        const data = await signUpWithEmail(email.trim(), password, displayName.trim());
        if (data?.user) {
          setMessage({
            type: 'success',
            text: '🎉 Account created! Your votes and food passport are now cloud-synced.',
          });
          onAuthSuccess(data.user);
          setTimeout(() => onClose(), 1200);
        }
      } else {
        const data = await signInWithEmail(email.trim(), password);
        if (data?.user) {
          setMessage({
            type: 'success',
            text: `Welcome back, ${data.user.user_metadata?.display_name || data.user.email?.split('@')[0]}!`,
          });
          onAuthSuccess(data.user);
          setTimeout(() => onClose(), 1000);
        }
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Authentication failed. Please check your credentials.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOutUser();
      onAuthSuccess(null);
      setMessage({ type: 'success', text: 'Signed out successfully.' });
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border-[2.5px] border-[#121212] bg-[#F6EFE2] p-6 shadow-[6px_6px_0px_#121212] text-[#121212] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#121212] bg-[#FFFFFF] shadow-[2px_2px_0px_#121212] hover:bg-[#FF5C9A] hover:text-white transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Title & Cloud Indicator */}
        <div className="space-y-1 mb-5">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-[#121212] bg-[#FFD11A] px-2.5 py-0.5 text-[10px] font-mono font-black uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00B26B] animate-pulse" />
            <span>Supabase Cloud Sync</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-[#121212]">
            {currentUser ? 'Your Cloud Profile' : mode === 'signup' ? 'Create Palate Account' : 'Sign In to Palate'}
          </h2>
          <p className="text-xs text-[#121212]/70 font-medium">
            {currentUser
              ? 'Your votes, check-ins, and food passport are currently synced across all devices.'
              : 'Keep your votes, dining check-ins, and passport streaks live across your phone and desktop.'}
          </p>
        </div>

        {/* Active Logged In View */}
        {currentUser ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border-2 border-[#121212] bg-white shadow-[3px_3px_0px_#121212] space-y-2">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#121212] bg-[#FFD11A] text-xl font-black">
                  {(currentUser.user_metadata?.display_name || currentUser.email || 'P')[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-black text-sm text-[#121212]">
                    {currentUser.user_metadata?.display_name || 'Navi Mumbai Foodie'}
                  </div>
                  <div className="text-xs text-[#121212]/70 font-mono">
                    {currentUser.email}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#121212]/20 flex items-center justify-between text-xs font-bold text-[#00B26B]">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Cloud Sync Active</span>
                </div>
                <span className="text-[10px] font-mono text-[#121212]/60">
                  ID: {currentUser.id.substring(0, 8)}...
                </span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 rounded-xl border-2 border-[#121212] bg-[#FF5C9A] p-3 text-xs font-black uppercase text-white shadow-[3px_3px_0px_#121212] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#121212] transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span>{loading ? 'Signing Out...' : 'Sign Out of Device'}</span>
            </button>
          </div>
        ) : (
          /* Form for Sign In / Sign Up */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl border-2 border-[#121212] bg-white text-xs font-black">
              <button
                type="button"
                onClick={() => { setMode('signin'); setMessage(null); }}
                className={`py-1.5 rounded-lg transition-all ${
                  mode === 'signin' ? 'bg-[#FFD11A] text-[#121212] border border-[#121212]' : 'text-[#121212]/60'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setMessage(null); }}
                className={`py-1.5 rounded-lg transition-all ${
                  mode === 'signup' ? 'bg-[#FFD11A] text-[#121212] border border-[#121212]' : 'text-[#121212]/60'
                }`}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => { setMode('magiclink'); setMessage(null); }}
                className={`py-1.5 rounded-lg transition-all ${
                  mode === 'magiclink' ? 'bg-[#FFD11A] text-[#121212] border border-[#121212]' : 'text-[#121212]/60'
                }`}
              >
                Magic Link
              </button>
            </div>

            {/* Display Name (Sign Up only) */}
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-[#121212]">
                  Diner Handle / Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-[#121212]/50" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Vashi Pav Bhaji Fanatic"
                    className="w-full rounded-xl border-2 border-[#121212] bg-white py-2.5 pl-9 pr-3 text-xs font-bold text-[#121212] placeholder:text-[#121212]/40 focus:outline-none focus:bg-[#FFD11A]/10 shadow-[2px_2px_0px_#121212]"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-[#121212]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#121212]/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="foodie@mumbai.com"
                  required
                  className="w-full rounded-xl border-2 border-[#121212] bg-white py-2.5 pl-9 pr-3 text-xs font-bold text-[#121212] placeholder:text-[#121212]/40 focus:outline-none focus:bg-[#FFD11A]/10 shadow-[2px_2px_0px_#121212]"
                />
              </div>
            </div>

            {/* Password Field (for signin and signup) */}
            {mode !== 'magiclink' && (
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-[#121212]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[#121212]/50" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full rounded-xl border-2 border-[#121212] bg-white py-2.5 pl-9 pr-3 text-xs font-bold text-[#121212] placeholder:text-[#121212]/40 focus:outline-none focus:bg-[#FFD11A]/10 shadow-[2px_2px_0px_#121212]"
                  />
                </div>
              </div>
            )}

            {/* Feedback Message */}
            {message && (
              <div
                className={`p-3 rounded-xl border-2 border-[#121212] text-xs font-bold flex items-start space-x-2 ${
                  message.type === 'success'
                    ? 'bg-[#E3F9ED] text-[#008A52]'
                    : 'bg-[#FFEBEB] text-[#D92D20]'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 rounded-xl border-2 border-[#121212] bg-[#FFD11A] p-3 text-xs font-black uppercase text-[#121212] shadow-[3px_3px_0px_#121212] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#121212] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {loading
                  ? 'Connecting to Supabase...'
                  : mode === 'signup'
                  ? 'Create Account & Sync'
                  : mode === 'magiclink'
                  ? 'Send Magic Link'
                  : 'Sign In & Sync'}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
