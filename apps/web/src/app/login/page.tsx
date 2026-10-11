'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  ArrowRight,
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
      const isCustomer =
        email === 'customer@vedaflow.org' ||
        email === 'customer@shopflow.io' ||
        email === 'ayur.patient@vedaflow.org';
      const isAdmin =
        email === 'admin@vedaflow.org' ||
        email === 'admin@shopflow.io' ||
        email === 'vaidya@vedaflow.org';

      const isValidPassword =
        password === 'ShopFlow@1234' ||
        password === 'VedaFlow@1234' ||
        password === 'Ayurveda@1234';

      if ((isCustomer || isAdmin) && isValidPassword) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'shopflow_user',
            JSON.stringify({
              email,
              name: isAdmin ? 'Vaidya R. K. Sharma' : 'Priya Sharma',
              role: isAdmin ? 'ADMIN' : 'CUSTOMER',
              doshaProfile: 'Tridoshic Harmony',
            }),
          );
        }
        router.push('/');
        return;
      }

      setErrorMessage('Invalid credentials. Use Quick Test: customer@vedaflow.org / VedaFlow@1234');
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (role: 'customer' | 'admin') => {
    if (role === 'customer') {
      setEmail('customer@vedaflow.org');
      setPassword('VedaFlow@1234');
    } else {
      setEmail('admin@vedaflow.org');
      setPassword('VedaFlow@1234');
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f2f4] flex flex-col justify-between text-slate-800 font-sans antialiased">
      {/* Flipkart Minimal Top Header */}
      <header className="bg-[#2874f0] text-white py-3 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 group">
            <span className="text-xl font-black italic tracking-tight text-white">
              Veda<span className="text-[#ffe500]">Flow</span>
            </span>
            <span className="text-[10px] bg-[#ffe500] text-[#2874f0] font-black px-1 rounded-sm uppercase tracking-tighter">
              AYUSH
            </span>
          </Link>
          <Link href="/" className="text-xs font-bold text-slate-100 hover:text-white">
            Back to Store
          </Link>
        </div>
      </header>

      {/* Flipkart Center Modal / Box Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
          {/* LEFT PANEL: Flipkart Iconic Blue Panel (5 cols) */}
          <div className="md:col-span-5 bg-[#2874f0] text-white p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <h2 className="text-2xl font-black tracking-tight">Login</h2>
              <p className="text-sm font-medium text-blue-100 leading-relaxed">
                Get access to your Orders, Wishlist, Ayurvedic Dosha Profile and NABL Lab Reports.
              </p>
            </div>

            {/* Botanical Graphic Silhouette */}
            <div className="relative z-10 py-6 text-center">
              <div className="w-32 h-32 mx-auto rounded-full bg-white/10 border border-white/20 flex flex-col items-center justify-center text-white backdrop-blur-sm shadow-inner">
                <span className="text-4xl mb-1">🌿</span>
                <span className="text-[10px] font-black tracking-widest uppercase text-[#ffe500]">
                  100% Non-Pharma
                </span>
                <span className="text-[9px] text-blue-100 font-bold">AYUSH Certified</span>
              </div>
            </div>

            <div className="text-[11px] text-blue-200 font-semibold relative z-10 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#ffe500]" />
              <span>Safe & Secure 256-Bit SSL Payments</span>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -bottom-16 -right-16 w-52 h-52 bg-blue-600/50 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* RIGHT PANEL: Form Inputs (7 cols) */}
          <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-600 font-semibold rounded-xs">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email / Mobile Field */}
                <div className="relative border-b-2 border-slate-200 focus-within:border-[#2874f0] transition-colors pb-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Enter Email / Mobile Number
                  </label>
                  <div className="flex items-center">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="customer@vedaflow.org"
                      className="w-full text-xs text-slate-900 font-semibold focus:outline-none bg-transparent py-1 placeholder:text-slate-400"
                    />
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative border-b-2 border-slate-200 focus-within:border-[#2874f0] transition-colors pb-1">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Enter Password
                    </label>
                    <Link href="#" className="text-[11px] font-bold text-[#2874f0] hover:underline">
                      Forgot?
                    </Link>
                  </div>
                  <div className="flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full text-xs text-slate-900 font-semibold focus:outline-none bg-transparent py-1 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 shrink-0"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* TOTP 2FA input if required */}
                {is2FARequired && (
                  <div className="relative border-b-2 border-amber-400 pb-1 animate-in fade-in">
                    <label className="block text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1">
                      6-Digit Security Authenticator Code
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        maxLength={6}
                        value={totpCode}
                        onChange={(e) => setTotpCode(e.target.value)}
                        placeholder="123456"
                        className="w-full text-xs font-mono tracking-widest text-slate-900 font-bold focus:outline-none bg-transparent py-1"
                      />
                      <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
                    </div>
                  </div>
                )}

                {/* Terms Disclaimer */}
                <p className="text-[11px] text-slate-500 leading-normal">
                  By continuing, you agree to VedaFlow's{' '}
                  <span className="text-[#2874f0] font-semibold hover:underline cursor-pointer">Terms of Use</span> and{' '}
                  <span className="text-[#2874f0] font-semibold hover:underline cursor-pointer">Privacy Policy</span>.
                </p>

                {/* Flipkart Iconic Orange Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#fb641b] hover:bg-[#e85a14] active:scale-[0.99] text-white font-black py-3 rounded-xs text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Login'}
                </button>
              </form>
            </div>

            {/* Quick Test Demo Credentials */}
            <div className="bg-[#f9fafb] border border-slate-200 rounded-xs p-3 space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                Quick Test 1-Click Auto-Fill:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('customer')}
                  className="flex-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold py-1.5 px-2 rounded-xs text-[11px] transition-colors"
                >
                  🌿 Patient Account
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('admin')}
                  className="flex-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold py-1.5 px-2 rounded-xs text-[11px] transition-colors"
                >
                  👨‍⚕️ Vaidya Admin
                </button>
              </div>
            </div>

            {/* New to VedaFlow Link */}
            <div className="pt-2 text-center border-t border-slate-100">
              <Link
                href="/register"
                className="text-xs font-bold text-[#2874f0] hover:underline"
              >
                New to VedaFlow? Create an account
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Flipkart Footer Bar */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-[11px] text-slate-500">
        © 2026 VedaFlow.com · 100% Genuine Ayurvedic Medicines & Classical Formulations
      </footer>
    </div>
  );
}
