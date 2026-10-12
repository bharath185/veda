'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Phone,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();

  // Mode: 'otp' (default Flipkart mobile login) or 'password'
  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');

  // OTP flow steps: 'phone_input' | 'otp_verify'
  const [otpStep, setOtpStep] = useState<'phone_input' | 'otp_verify'>('phone_input');

  const [mobileNumber, setMobileNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendSeconds, setResendSeconds] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Password fallback state
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Refs for 6 digit inputs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpStep === 'otp_verify' && resendSeconds > 0) {
      timer = setTimeout(() => {
        setResendSeconds((prev) => prev - 1);
      }, 1000);
    } else if (resendSeconds === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [otpStep, resendSeconds]);

  // Handle phone submit -> trigger OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanNumber = mobileNumber.replace(/\D/g, '');
    if (cleanNumber.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpStep('otp_verify');
      setResendSeconds(30);
      setCanResend(false);
      // Auto focus first OTP box
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    }, 600);
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!paste) return;
    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = paste[i] || '';
    }
    setOtpDigits(newDigits);
    inputRefs.current[Math.min(paste.length, 5)]?.focus();
  };

  // Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsLoading(false);
      const isAdminNumber = mobileNumber.includes('98111') || mobileNumber.includes('admin');
      const userObj = {
        phone: `+91 ${mobileNumber}`,
        name: isAdminNumber ? 'Vaidya R. K. Sharma' : 'Priya Sharma',
        role: (isAdminNumber ? 'ADMIN' : 'CUSTOMER') as 'ADMIN' | 'CUSTOMER',
        doshaProfile: 'Tridoshic Harmony',
      };

      useAuthStore.getState().login(userObj, 'veda-demo-token-jwt');

      setSuccessMessage('✓ Mobile OTP Verified! Logging into VedaFlow...');
      setTimeout(() => {
        router.push('/');
      }, 700);
    }, 600);
  };

  // Quick Demo Auto-Fill helper
  const handleFillDemoPhone = (type: 'customer' | 'admin') => {
    setErrorMessage('');
    if (type === 'customer') {
      setMobileNumber('9876543210');
    } else {
      setMobileNumber('9811122334');
    }
  };

  const handleFillDemoOtp = () => {
    setOtpDigits(['4', '8', '2', '6', '1', '9']);
    setErrorMessage('');
  };

  // Fallback Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsLoading(false);
      const isAdmin = emailOrPhone.includes('admin') || emailOrPhone.includes('vaidya');
      const userObj = {
        email: emailOrPhone,
        name: isAdmin ? 'Vaidya R. K. Sharma' : 'Priya Sharma',
        role: (isAdmin ? 'ADMIN' : 'CUSTOMER') as 'ADMIN' | 'CUSTOMER',
        doshaProfile: 'Tridoshic Harmony',
      };
      useAuthStore.getState().login(userObj, 'veda-demo-token-jwt');
      setSuccessMessage('✓ Authenticated successfully! Redirecting...');
      setTimeout(() => router.push('/'), 700);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f1f2f4] flex flex-col justify-between text-slate-800 font-sans antialiased">
      {/* Flipkart Header */}
      <header className="bg-[#2874f0] text-white py-3 px-4 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 group">
            <span className="text-xl font-black italic tracking-tight text-white">
              Veda<span className="text-[#ffe500]">Flow</span>
            </span>
            <span className="text-[10px] bg-[#ffe500] text-[#2874f0] font-black px-1 rounded-sm uppercase tracking-tighter">
              AYUSH
            </span>
          </Link>
          <Link href="/" className="text-xs font-bold text-slate-100 hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 my-4">
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
          {/* LEFT PANEL: Flipkart Blue (5 cols) */}
          <div className="md:col-span-5 bg-[#2874f0] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-3 relative z-10">
              <h2 className="text-2xl font-black tracking-tight">Login</h2>
              <p className="text-sm font-medium text-blue-100 leading-relaxed">
                Get access to your Orders, Wishlist, Ayurvedic Formulations, SuperCoins and NABL Lab Reports.
              </p>
            </div>

            {/* Ayurvedic Seal Graphic */}
            <div className="relative z-10 py-6 text-center">
              <div className="w-32 h-32 mx-auto rounded-full bg-white/10 border border-white/20 flex flex-col items-center justify-center text-white backdrop-blur-sm shadow-inner">
                <span className="text-4xl mb-1">🌿</span>
                <span className="text-[10px] font-black tracking-widest uppercase text-[#ffe500]">
                  100% Non-Pharma
                </span>
                <span className="text-[9px] text-blue-100 font-bold">Charaka Samhita</span>
              </div>
            </div>

            <div className="text-[11px] text-blue-200 font-semibold relative z-10 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#ffe500]" />
              <span>Direct OTP Verification · No Spam Guarantee</span>
            </div>

            {/* Ambient blur circle */}
            <div className="absolute -bottom-16 -right-16 w-52 h-52 bg-blue-600/50 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* RIGHT PANEL: Form Inputs (7 cols) */}
          <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-600 font-semibold rounded-xs">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-bold rounded-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* FLOW 1: MOBILE OTP FLOW */}
              {authMode === 'otp' && (
                <>
                  {otpStep === 'phone_input' ? (
                    /* Step 1: Mobile Phone Number Input */
                    <form onSubmit={handleRequestOtp} className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider">
                          Enter 10-Digit Mobile Number
                        </label>
                        <div className="flex items-center border-b-2 border-slate-300 focus-within:border-[#2874f0] transition-colors pb-1">
                          <span className="text-sm font-bold text-slate-600 mr-2 flex items-center gap-1 select-none">
                            🇮🇳 +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            required
                            autoFocus
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                            placeholder="98765 43210"
                            className="w-full text-base font-bold text-slate-900 tracking-wider focus:outline-none bg-transparent py-1 placeholder:text-slate-300"
                          />
                          <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-normal">
                        By continuing, you agree to VedaFlow's{' '}
                        <span className="text-[#2874f0] font-semibold hover:underline cursor-pointer">
                          Terms of Use
                        </span>{' '}
                        and{' '}
                        <span className="text-[#2874f0] font-semibold hover:underline cursor-pointer">
                          Privacy Policy
                        </span>
                        . An instant 6-digit verification code will be sent.
                      </p>

                      {/* Flipkart Iconic Orange CTA Button */}
                      <button
                        type="submit"
                        disabled={isLoading || mobileNumber.length < 10}
                        className="w-full bg-[#fb641b] hover:bg-[#e85a14] active:scale-[0.99] text-white font-black py-3 rounded-xs text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Requesting OTP...</span>
                          </>
                        ) : (
                          <>
                            <span>REQUEST OTP</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    /* Step 2: 6-Digit OTP Verification Screen */
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider">
                            Enter 6-Digit OTP
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setOtpStep('phone_input');
                              setOtpDigits(['', '', '', '', '', '']);
                              setErrorMessage('');
                            }}
                            className="text-xs font-bold text-[#2874f0] hover:underline"
                          >
                            Change Number
                          </button>
                        </div>

                        <p className="text-xs text-slate-500">
                          Sent to <span className="font-bold text-slate-800">+91 {mobileNumber}</span>
                        </p>

                        {/* 6 Digit Input Boxes */}
                        <div className="flex justify-between gap-2 pt-2" onPaste={handleOtpPaste}>
                          {otpDigits.map((digit, idx) => (
                            <input
                              key={idx}
                              ref={(el) => {
                                inputRefs.current[idx] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              className="w-11 h-12 text-center text-lg font-black text-slate-900 border-2 rounded-xs border-slate-300 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] focus:outline-none transition-all bg-white"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Resend Countdown */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        {canResend ? (
                          <button
                            type="button"
                            onClick={() => {
                              setResendSeconds(30);
                              setCanResend(false);
                            }}
                            className="font-bold text-[#2874f0] hover:underline flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" /> Resend OTP
                          </button>
                        ) : (
                          <span className="text-slate-400 font-medium">
                            Resend OTP in <strong className="text-slate-700 font-bold">{resendSeconds}s</strong>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={handleFillDemoOtp}
                          className="text-[#2874f0] font-bold hover:underline text-[11px] flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-[#2874f0]" /> Auto-fill Demo OTP (482619)
                        </button>
                      </div>

                      {/* Verify Button */}
                      <button
                        type="submit"
                        disabled={isLoading || otpDigits.join('').length < 6}
                        className="w-full bg-[#fb641b] hover:bg-[#e85a14] active:scale-[0.99] text-white font-black py-3 rounded-xs text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Verifying OTP...</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4" />
                            <span>VERIFY & LOGIN</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </>
              )}

              {/* FLOW 2: PASSWORD LOGIN FALLBACK */}
              {authMode === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-5">
                  <div className="border-b-2 border-slate-200 focus-within:border-[#2874f0] transition-colors pb-1">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Email or Mobile Number
                    </label>
                    <input
                      type="text"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="customer@vedaflow.org"
                      className="w-full text-xs text-slate-900 font-semibold focus:outline-none bg-transparent py-1"
                    />
                  </div>

                  <div className="border-b-2 border-slate-200 focus-within:border-[#2874f0] transition-colors pb-1">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Password
                      </label>
                      <span className="text-[11px] font-bold text-[#2874f0] hover:underline cursor-pointer">
                        Forgot?
                      </span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
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

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#fb641b] hover:bg-[#e85a14] active:scale-[0.99] text-white font-black py-3 rounded-xs text-xs uppercase tracking-wider shadow-sm transition-all"
                  >
                    {isLoading ? 'Verifying...' : 'LOGIN'}
                  </button>
                </form>
              )}
            </div>

            {/* Quick Demo Credentials / Mode Switcher */}
            <div className="space-y-3 pt-2">
              <div className="bg-[#f9fafb] border border-slate-200 rounded-xs p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    Quick Test 1-Click Numbers:
                  </span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-2xs">
                    Demo Mode Active
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleFillDemoPhone('customer')}
                    className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold py-1.5 px-2 rounded-xs text-[11px] text-left transition-colors flex items-center justify-between"
                  >
                    <span>🌿 Customer Demo</span>
                    <span className="text-[9px] text-slate-400 font-mono">98765..</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemoPhone('admin')}
                    className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold py-1.5 px-2 rounded-xs text-[11px] text-left transition-colors flex items-center justify-between"
                  >
                    <span>👨‍⚕️ Vaidya Admin</span>
                    <span className="text-[9px] text-slate-400 font-mono">98111..</span>
                  </button>
                </div>
              </div>

              {/* Toggle Login Method */}
              <div className="flex items-center justify-between text-xs pt-1">
                {authMode === 'otp' ? (
                  <button
                    type="button"
                    onClick={() => setAuthMode('password')}
                    className="text-slate-600 hover:text-[#2874f0] font-semibold text-[11px] underline"
                  >
                    Use Password instead
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAuthMode('otp')}
                    className="text-[#2874f0] hover:underline font-bold text-[11px] flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" /> Login via Mobile OTP
                  </button>
                )}

                <Link href="/register" className="text-xs font-bold text-[#2874f0] hover:underline">
                  New to VedaFlow? Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Flipkart Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-[11px] text-slate-500">
        © 2026 VedaFlow.com · 100% Genuine Ayurvedic Medicines & Classical Formulations · AYUSH Compliant
      </footer>
    </div>
  );
}
