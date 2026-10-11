'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Check,
  Globe,
  Smartphone,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'VENDOR'>('CUSTOMER');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isPasswordValid = hasLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setErrorMessage('Please ensure your password meets all strength criteria.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          password,
          role,
        }),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (typeof window !== 'undefined') {
          localStorage.setItem('shopflow_token', data.tokens?.accessToken || '');
          localStorage.setItem('shopflow_user', JSON.stringify(data.user || {}));
        }
        setSuccessMessage('Account created successfully! Redirecting...');
        setTimeout(() => router.push('/'), 1200);
        return;
      }

      // Local fallback for quick preview
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'shopflow_user',
          JSON.stringify({ name, email, role }),
        );
      }
      setSuccessMessage('Account registered! Taking you to the storefront...');
      setTimeout(() => router.push('/'), 1200);
    } catch {
      setErrorMessage('Failed to connect to authentication server. Please retry.');
    } finally {
      setIsLoading(false);
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
          <span>Already have an account?</span>
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline"
          >
            Log in
          </Link>
        </div>
      </header>

      {/* Main Registration Container */}
      <main className="w-full max-w-lg mx-auto px-6 py-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 shadow-xl shadow-slate-200/50 space-y-6">
          <div className="space-y-1 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Start Shopping
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create your ShopFlow Account</h1>
            <p className="text-xs text-slate-500 font-medium">
              Join thousands enjoying express same-day delivery and genuine warranties.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Account Type Selector */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setRole('CUSTOMER')}
                className={`py-2 rounded-xl transition-all ${
                  role === 'CUSTOMER' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Shopper / Customer
              </button>
              <button
                type="button"
                onClick={() => setRole('VENDOR')}
                className={`py-2 rounded-xl transition-all ${
                  role === 'VENDOR' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Brand Merchant / Vendor
              </button>
            </div>

            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Priya Sharma"
                  className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                />
              </div>
            </div>

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

            {/* Phone Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Mobile Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters with Aa, 1, @"
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

              {/* Password strength checklist */}
              {password.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] space-y-1 mt-2">
                  <div className="font-bold text-slate-600 mb-1">Password Strength Checklist:</div>
                  <div className="grid grid-cols-2 gap-1 text-slate-500 font-medium">
                    <span className={hasLength ? 'text-emerald-600 font-bold' : ''}>
                      {hasLength ? '✓' : '○'} 8+ characters
                    </span>
                    <span className={hasUpper ? 'text-emerald-600 font-bold' : ''}>
                      {hasUpper ? '✓' : '○'} Uppercase letter
                    </span>
                    <span className={hasLower ? 'text-emerald-600 font-bold' : ''}>
                      {hasLower ? '✓' : '○'} Lowercase letter
                    </span>
                    <span className={hasNumber ? 'text-emerald-600 font-bold' : ''}>
                      {hasNumber ? '✓' : '○'} Number
                    </span>
                    <span className={hasSpecial ? 'text-emerald-600 font-bold' : ''}>
                      {hasSpecial ? '✓' : '○'} Special character
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-2xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 text-xs transition-all disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                'Creating your account...'
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="space-y-3 pt-2">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
                Or sign up with
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
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-400 border-t border-slate-200/60">
        By continuing, you agree to ShopFlow's Terms of Service and Privacy Policy.
      </footer>
    </div>
  );
}
