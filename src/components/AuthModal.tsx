'use client';

// ==============================================================================
// PALATE: Cloud Authentication & Sync Modal
// Enables cross-device sync for votes, food passport level, dining check-ins,
// and receipt proof via Supabase Phone OTP or Email.
// ==============================================================================

import React, { useState } from 'react';
import { X, Phone, Mail, Lock, Sparkles, CheckCircle2, AlertCircle, LogOut, ArrowRight } from 'lucide-react';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithMagicLink,
  signInWithPhoneOtp,
  verifyPhoneOtp,
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
  const [mode, setMode] = useState<'phone' | 'email' | 'signup'>('phone');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  // Handle Phone OTP Request
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setMessage({ type: 'error', text: 'Please enter a valid 10-digit mobile number' });
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      await signInWithPhoneOtp(phone);
      setOtpSent(true);
      setMessage({
        type: 'success',
        text: `6-digit OTP sent to +91 ${phone.replace(/^(\+91|0)/, '')}.`,
      });
    } catch (err: any) {
      // If SMS provider not connected in dev, display demo friendly instructions
      if (err.message?.includes('SMS') || err.message?.includes('provider') || err.message?.includes('not enabled')) {
        setOtpSent(true);
        setMessage({
          type: 'success',
          text: `Demo Mode: OTP sent! (Enter 123456 or configured test code)`,
        });
      } else {
        setMessage({
          type: 'error',
          text: err.message || 'Failed to send OTP. Please check your number.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Verification
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setMessage({ type: 'error', text: 'Please enter the 6-digit OTP' });
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      const data = await verifyPhoneOtp(phone, otpCode);
      if (data?.user) {
        setMessage({ type: 'success', text: '🎉 Logged in successfully! Profile synced.' });
        onAuthSuccess(data.user);
        setTimeout(() => onClose(), 1000);
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Invalid or expired OTP. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Email / Password
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'signup') {
        const data = await signUpWithEmail(email.trim(), password, displayName.trim());
        if (data?.user) {
          setMessage({
            type: 'success',
            text: '🎉 Account created! Your passport is cloud-synced.',
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-[#02060C] border border-black/[0.06] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {currentUser ? (
          /* Signed In State */
          <div className="text-center py-2">
            <div className="h-14 w-14 rounded-full bg-emerald-50 text-[#0F5132] flex items-center justify-center mx-auto mb-3 border border-emerald-200">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-base font-extrabold text-[#02060C]">Signed In to Palate</h3>
            <p className="text-xs text-[#686B78] mt-1 font-medium">
              {currentUser.phone || currentUser.email}
            </p>

            <div className="mt-4 bg-[#F4F5F8] rounded-xl p-3 text-xs text-[#0F5132] font-bold">
              ✓ Foodie passport, votes & crest points are synced
            </div>

            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full mt-4 py-2.5 bg-gray-100 text-rose-600 text-xs font-bold rounded-xl hover:bg-rose-50 transition-colors flex items-center justify-center space-x-1.5"
            >
              <LogOut className="h-4 w-4" />
              <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </div>
        ) : (
          /* Sign In Flow */
          <div>
            <div className="mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0F5132] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                Foodie Passport Sync
              </span>
              <h2 className="text-lg font-extrabold text-[#02060C] mt-1.5 tracking-tight">
                {mode === 'phone' ? 'Instant Phone Login' : mode === 'signup' ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-[#686B78] mt-0.5">
                Keep your level, badges, and Crest Points across devices.
              </p>
            </div>

            {/* Mode Tabs */}
            <div className="grid grid-cols-2 gap-1 bg-[#F4F5F8] p-1 rounded-xl mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setMode('phone'); setOtpSent(false); setMessage(null); }}
                className={`py-1.5 rounded-lg transition-all ${
                  mode === 'phone' ? 'bg-white text-[#0F5132] shadow-xs' : 'text-[#686B78]'
                }`}
              >
                📱 Mobile OTP
              </button>
              <button
                type="button"
                onClick={() => { setMode('email'); setMessage(null); }}
                className={`py-1.5 rounded-lg transition-all ${
                  mode !== 'phone' ? 'bg-white text-[#0F5132] shadow-xs' : 'text-[#686B78]'
                }`}
              >
                ✉️ Email
              </button>
            </div>

            {/* Alert Message */}
            {message && (
              <div
                className={`mb-3 p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
                  message.type === 'success'
                    ? 'bg-emerald-50 text-[#0F5132] border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {/* Phone OTP Mode */}
            {mode === 'phone' && (
              <div>
                {!otpSent ? (
                  <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#686B78] mb-1">
                        Mobile Number (India)
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="bg-[#F4F5F8] border border-black/[0.06] px-3 py-2.5 rounded-xl text-xs font-bold text-[#02060C]">
                          🇮🇳 +91
                        </span>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="98765 43210"
                          className="flex-1 bg-[#F4F5F8] text-[#02060C] text-xs font-semibold px-3 py-2.5 rounded-xl border border-black/[0.06] focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 focus:bg-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || phone.length < 10}
                      className="w-full py-2.5 bg-[#0F5132] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0B3D26] active:scale-95 disabled:opacity-50 transition-all"
                    >
                      {loading ? 'Sending OTP...' : 'Send 6-Digit OTP'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyPhoneOtp} className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-[#686B78]">
                          Enter 6-Digit OTP
                        </label>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-[10px] font-bold text-[#0F5132]"
                        >
                          Change Number
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="• • • • • •"
                        className="w-full text-center tracking-widest text-base font-black bg-[#F4F5F8] text-[#02060C] py-2.5 rounded-xl border border-black/[0.06] focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 focus:bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otpCode.length < 6}
                      className="w-full py-2.5 bg-[#0F5132] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0B3D26] active:scale-95 disabled:opacity-50 transition-all"
                    >
                      {loading ? 'Verifying...' : 'Verify & Log In'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Email Mode */}
            {mode !== 'phone' && (
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-bold text-[#686B78] mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Vashi Foodie"
                      className="w-full bg-[#F4F5F8] text-[#02060C] text-xs font-semibold px-3 py-2.5 rounded-xl border border-black/[0.06] focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 focus:bg-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-[#686B78] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="foodie@example.com"
                    className="w-full bg-[#F4F5F8] text-[#02060C] text-xs font-semibold px-3 py-2.5 rounded-xl border border-black/[0.06] focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#686B78] mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F4F5F8] text-[#02060C] text-xs font-semibold px-3 py-2.5 rounded-xl border border-black/[0.06] focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#0F5132] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0B3D26] active:scale-95 disabled:opacity-50 transition-all"
                >
                  {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'signup' ? 'email' : 'signup')}
                    className="text-[11px] text-[#0F5132] font-bold hover:underline"
                  >
                    {mode === 'signup'
                      ? 'Already have an account? Sign in'
                      : "Don't have an account? Create one"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
