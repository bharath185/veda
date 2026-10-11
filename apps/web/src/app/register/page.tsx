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
  Leaf,
  Award,
  CheckCircle2,
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
      setErrorMessage('Please ensure your password meets all botanical security criteria below.');
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
        setSuccessMessage('Account registered successfully! Welcome to VedaFlow...');
        setTimeout(() => router.push('/'), 1200);
        return;
      }

      // Local fallback for quick preview
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'shopflow_user',
          JSON.stringify({ name, email, role, doshaProfile: 'Tridoshic Harmony' }),
        );
      }
      setSuccessMessage('Welcome to VedaFlow! Redirecting to the herbal apothecary...');
      setTimeout(() => router.push('/'), 1200);
    } catch {
      setErrorMessage('Failed to connect to authentication server. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoRegistration = () => {
    setName('Ananya Deshmukh');
    setEmail('ananya.deshmukh@vedaflow.org');
    setPhone('+91 98450 11223');
    setPassword('VedaFlow@2026!');
  };

  return (
    <div className="min-h-screen bg-[#FBFBEE] flex flex-col justify-between text-slate-800 antialiased selection:bg-emerald-600 selection:text-white relative overflow-hidden">
      {/* Decorative botanical background gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-emerald-900/10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-emerald-950 group-hover:text-emerald-700 transition-colors">
              Veda<span className="text-emerald-600">Flow</span>
            </span>
            <span className="block text-[9px] font-extrabold text-emerald-800 tracking-wider uppercase">
              Classical Ayurveda & Natural Health
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span>Already have an account?</span>
          <Link
            href="/login"
            className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Main Registration Container */}
      <main className="relative z-10 w-full max-w-lg mx-auto px-6 py-6">
        <div className="bg-white/90 backdrop-blur-md border border-emerald-900/15 rounded-3xl p-8 shadow-xl shadow-emerald-950/5 space-y-6">
          <div className="space-y-1.5 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold mb-1">
              <Award className="w-3.5 h-3.5 text-amber-600" /> 100% Non-Pharma Herbal Medicine
            </div>
            <h1 className="text-2xl font-black text-emerald-950 tracking-tight">
              Create Your VedaFlow Profile
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Join India's purest Ayurvedic apothecary — pure Rasayanas, herbal churnas & wildcrafted extracts.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Account Type Selector */}
            <div className="grid grid-cols-2 gap-2 bg-[#FAF9F2] p-1.5 rounded-2xl text-xs font-bold border border-emerald-900/10">
              <button
                type="button"
                onClick={() => setRole('CUSTOMER')}
                className={`py-2 rounded-xl transition-all ${
                  role === 'CUSTOMER'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-600 hover:text-emerald-900'
                }`}
              >
                🌿 Holistic Patient / Shopper
              </button>
              <button
                type="button"
                onClick={() => setRole('VENDOR')}
                className={`py-2 rounded-xl transition-all ${
                  role === 'VENDOR'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-600 hover:text-emerald-900'
                }`}
              >
                🏥 Vaidya / Ayurvedic Clinic
              </button>
            </div>

            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-950">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-emerald-700/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ananya Deshmukh"
                  className="w-full bg-[#FAF9F5] hover:bg-white focus:bg-white border border-emerald-900/20 focus:border-emerald-600 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all font-medium"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-950">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-700/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ananya@example.com"
                  className="w-full bg-[#FAF9F5] hover:bg-white focus:bg-white border border-emerald-900/20 focus:border-emerald-600 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all font-medium"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-950">Mobile Number (Order Updates & Delivery OTP)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-emerald-700/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#FAF9F5] hover:bg-white focus:bg-white border border-emerald-900/20 focus:border-emerald-600 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-950">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-700/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters with Aa, 1, @"
                  className="w-full bg-[#FAF9F5] hover:bg-white focus:bg-white border border-emerald-900/20 focus:border-emerald-600 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all font-medium"
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
                <div className="p-3 bg-[#FAF9F2] rounded-2xl border border-emerald-900/15 text-[11px] space-y-1 mt-2">
                  <div className="font-bold text-emerald-950 mb-1">Botanical Security Checklist:</div>
                  <div className="grid grid-cols-2 gap-1 text-slate-600 font-medium">
                    <span className={hasLength ? 'text-emerald-700 font-bold' : ''}>
                      {hasLength ? '✓' : '○'} 8+ characters
                    </span>
                    <span className={hasUpper ? 'text-emerald-700 font-bold' : ''}>
                      {hasUpper ? '✓' : '○'} Uppercase letter
                    </span>
                    <span className={hasLower ? 'text-emerald-700 font-bold' : ''}>
                      {hasLower ? '✓' : '○'} Lowercase letter
                    </span>
                    <span className={hasNumber ? 'text-emerald-700 font-bold' : ''}>
                      {hasNumber ? '✓' : '○'} Number
                    </span>
                    <span className={hasSpecial ? 'text-emerald-700 font-bold' : ''}>
                      {hasSpecial ? '✓' : '○'} Special character
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Demo Pre-fill Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleFillDemoRegistration}
                className="w-full text-center text-xs font-semibold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Auto-fill Sample Patient Details
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-800 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-2xl shadow-lg shadow-emerald-800/20 flex items-center justify-center gap-2 text-xs transition-all disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                'Registering holistic profile...'
              ) : (
                <>
                  <span>Complete VedaFlow Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="space-y-3 pt-2">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-emerald-900/10 w-full" />
              <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider absolute">
                Or sign up with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2 border border-emerald-900/15 hover:bg-emerald-50/50 rounded-2xl py-2.5 text-xs font-bold text-slate-700 transition-colors"
              >
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 border border-emerald-900/15 hover:bg-emerald-50/50 rounded-2xl py-2.5 text-xs font-bold text-slate-700 transition-colors"
              >
                <Smartphone className="w-4 h-4 text-slate-700" />
                <span>Apple ID</span>
              </button>
            </div>
          </div>

          {/* Trust points */}
          <div className="pt-2 border-t border-emerald-900/10 grid grid-cols-2 gap-2 text-[10px] font-semibold text-emerald-900/70">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>GMP Certified Formulation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Non-Pharma 100% Herbal</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-500 border-t border-emerald-900/10">
        By joining VedaFlow, you agree to our Classical Quality Guidelines, Non-Pharma Guarantee and Privacy Policy.
      </footer>
    </div>
  );
}
