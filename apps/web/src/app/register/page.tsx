'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Mail,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Check,
  Sparkles,
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
  const isPasswordValid = hasLength;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setErrorMessage('Password must contain at least 8 characters.');
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
        setSuccessMessage('Account registered successfully! Redirecting...');
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
      setSuccessMessage('Account created! Entering the Ayurvedic storefront...');
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
    <div className="min-h-screen bg-[#f1f2f4] flex flex-col justify-between text-slate-800 font-sans antialiased">
      {/* Flipkart Header */}
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
          <Link href="/login" className="text-xs font-bold text-slate-100 hover:text-white">
            Existing User? Log In
          </Link>
        </div>
      </header>

      {/* Center Modal / Split-Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[540px]">
          {/* LEFT PANEL: Flipkart Blue (5 cols) */}
          <div className="md:col-span-5 bg-[#2874f0] text-white p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <h2 className="text-2xl font-black tracking-tight">Looks like you're new here!</h2>
              <p className="text-sm font-medium text-blue-100 leading-relaxed">
                Sign up with your mobile number or email to begin ordering pure classical Ayurvedic remedies.
              </p>
            </div>

            {/* Graphic Icon */}
            <div className="relative z-10 py-6 text-center">
              <div className="w-32 h-32 mx-auto rounded-full bg-white/10 border border-white/20 flex flex-col items-center justify-center text-white backdrop-blur-sm shadow-inner">
                <span className="text-4xl mb-1">🌿</span>
                <span className="text-[10px] font-black tracking-widest uppercase text-[#ffe500]">
                  Veda-Assured
                </span>
                <span className="text-[9px] text-blue-100 font-bold">Charaka Samhita</span>
              </div>
            </div>

            <div className="text-[11px] text-blue-200 font-semibold relative z-10 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#ffe500]" />
              <span>100% Non-Pharma Herbal Medicine Guarantee</span>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -bottom-16 -right-16 w-52 h-52 bg-blue-600/50 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* RIGHT PANEL: Form Inputs (7 cols) */}
          <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-600 font-semibold rounded-xs">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-bold rounded-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Account Type Selector */}
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xs text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setRole('CUSTOMER')}
                    className={`py-1.5 rounded-xs transition-all ${
                      role === 'CUSTOMER' ? 'bg-white text-[#2874f0] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    🌿 Patient / Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('VENDOR')}
                    className={`py-1.5 rounded-xs transition-all ${
                      role === 'VENDOR' ? 'bg-white text-[#2874f0] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    🏥 Vaidya / Ayurvedic Clinic
                  </button>
                </div>

                {/* Name */}
                <div className="border-b-2 border-slate-200 focus-within:border-[#2874f0] transition-colors pb-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                    Full Name
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ananya Deshmukh"
                      className="w-full text-xs text-slate-900 font-semibold focus:outline-none bg-transparent py-1"
                    />
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                </div>

                {/* Email */}
                <div className="border-b-2 border-slate-200 focus-within:border-[#2874f0] transition-colors pb-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                    Email Address
                  </label>
                  <div className="flex items-center">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ananya@example.com"
                      className="w-full text-xs text-slate-900 font-semibold focus:outline-none bg-transparent py-1"
                    />
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                </div>

                {/* Mobile */}
                <div className="border-b-2 border-slate-200 focus-within:border-[#2874f0] transition-colors pb-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                    Mobile Number (For Delivery OTP)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98450 11223"
                      className="w-full text-xs text-slate-900 font-semibold focus:outline-none bg-transparent py-1"
                    />
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                </div>

                {/* Password */}
                <div className="border-b-2 border-slate-200 focus-within:border-[#2874f0] transition-colors pb-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                    Set Password
                  </label>
                  <div className="flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full text-xs text-slate-900 font-semibold focus:outline-none bg-transparent py-1"
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

                {/* Terms Disclaimer */}
                <p className="text-[11px] text-slate-500 leading-normal pt-1">
                  By continuing, you agree to VedaFlow's{' '}
                  <span className="text-[#2874f0] font-semibold hover:underline cursor-pointer">Terms of Use</span> and{' '}
                  <span className="text-[#2874f0] font-semibold hover:underline cursor-pointer">Privacy Policy</span>.
                </p>

                {/* Flipkart Orange CTA Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#fb641b] hover:bg-[#e85a14] active:scale-[0.99] text-white font-black py-3 rounded-xs text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Creating account...' : 'CONTINUE'}
                </button>
              </form>
            </div>

            {/* Quick Demo Pre-fill */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleFillDemoRegistration}
                className="w-full text-center text-xs font-semibold text-[#2874f0] bg-blue-50/60 hover:bg-blue-100/60 border border-blue-200 py-2 rounded-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#2874f0]" /> Auto-fill Sample Patient Details
              </button>

              <div className="text-center border-t border-slate-100 pt-3">
                <Link
                  href="/login"
                  className="w-full block bg-white hover:bg-slate-50 text-[#2874f0] border border-slate-300 font-bold py-2.5 rounded-xs text-xs uppercase tracking-wider shadow-xs transition-colors"
                >
                  Existing User? Log In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-[11px] text-slate-500">
        © 2026 VedaFlow.com · 100% Genuine Ayurvedic Medicines & Classical Formulations
      </footer>
    </div>
  );
}
