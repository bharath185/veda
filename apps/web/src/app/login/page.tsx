'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  KeyRound,
  Globe,
  Smartphone,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [is2FARequired, setIs2FARequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          code: totpCode || undefined,
        }),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (data.requires2FA) {
          setIs2FARequired(true);
          setIsLoading(false);
          return;
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('shopflow_token', data.tokens?.accessToken || '');
          localStorage.setItem('shopflow_user', JSON.stringify(data.user || {}));
        }
        router.push('/');
        return;
      }

      // Demo/Fallback login for pre-seeded test accounts
      if (
        (email === 'customer@shopflow.io' || email === 'admin@shopflow.io') &&
        password === 'ShopFlow@1234'
      ) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'shopflow_user',
            JSON.stringify({ email, name: email.includes('admin') ? 'Admin' : 'Priya Sharma', role: 'CUSTOMER' }),
          );
        }
        router.push('/');
        return;
      }

      setErrorMessage('Invalid email or password. You can use test account: customer@shopflow.io / ShopFlow@1234');
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (role: 'customer' | 'admin') => {
    if (role === 'customer') {
      setEmail('customer@shopflow.io');
      setPassword('ShopFlow@1234');
    } else {
      setEmail('admin@shopflow.io');
      setPassword('ShopFlow@1234');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/30 to-white flex flex-col justify-between text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              Shop<span className="text-indigo-600">Flow</span>
            </span>
            <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase">Official Store</span>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span>Don't have an account?</span>
          <Link
            href="/register"
            className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline"
          >
            Create account
          </Link>
        </div>
      </header>

      {/* Main Form Center */}
      <main className="w-full max-w-md mx-auto px-6 py-8">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 shadow-xl shadow-slate-200/50 space-y-6">
          <div className="space-y-1 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Welcome Back
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign in to ShopFlow</h1>
            <p className="text-xs text-slate-500 font-medium">
              Manage your orders, saved addresses, and express checkout.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@example.com"
                  className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <Link href="#" className="text-[11px] font-bold text-indigo-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* TOTP 2FA input if required */}
            {is2FARequired && (
              <div className="space-y-1.5 pt-2 animate-in fade-in">
                <label className="block text-xs font-bold text-slate-700">6-Digit 2FA Authenticator Code</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-50 border border-indigo-300 rounded-2xl pl-10 pr-4 py-2.5 text-xs tracking-widest font-mono text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-2xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 text-xs transition-all disabled:opacity-50"
            >
              {isLoading ? (
                'Verifying credentials...'
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="space-y-3">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
                Or continue with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 rounded-2xl py-2.5 text-xs font-bold text-slate-700 transition-colors"
              >
                <Globe className="w-4 h-4 text-indigo-500" />
                <span>Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 rounded-2xl py-2.5 text-xs font-bold text-slate-700 transition-colors"
              >
                <Smartphone className="w-4 h-4 text-slate-700" />
                <span>Apple</span>
              </button>
            </div>
          </div>

          {/* Demo Quick-Fill Pill */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2 text-xs">
            <span className="font-extrabold text-[11px] text-slate-600 uppercase tracking-wider block">
              Quick Test Credentials
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('customer')}
                className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-1.5 px-2 rounded-xl text-[11px] transition-colors"
              >
                Auto-fill Customer
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('admin')}
                className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-1.5 px-2 rounded-xl text-[11px] transition-colors"
              >
                Auto-fill Admin
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-400 border-t border-slate-200/60">
        © 2026 ShopFlow Inc. Protected by 256-bit SSL encryption. All rights reserved.
      </footer>
    </div>
  );
}
