'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  FileText,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Clock,
  PhoneCall,
  Sparkles,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  Award,
  Truck,
  Percent,
} from 'lucide-react';
import { DesktopHeader } from '../../components/desktop/DesktopHeader';
import { MobileBottomNav } from '../../components/mobile/MobileBottomNav';
import { useAuthStore } from '../../store/useAuthStore';

export default function UploadPrescriptionPage() {
  const { user } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [phone, setPhone] = useState(user?.phone || '');
  const [deliveryPin, setDeliveryPin] = useState('560001');
  const [orderPreference, setOrderPreference] = useState<'substitute' | 'exact'>('substitute');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rxOrderId, setRxOrderId] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !previewUrl) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `RX-VEDA-${Math.floor(100000 + Math.random() * 900000)}`;
      setRxOrderId(generatedId);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f1f2f4] text-slate-800 font-sans flex flex-col justify-between">
      <DesktopHeader />

      <main className="max-w-5xl mx-auto w-full px-3 sm:px-4 py-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-white px-4 py-2.5 rounded-sm shadow-xs border border-slate-200">
          <Link href="/" className="hover:text-[#128983]">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-900">Upload Prescription & Save up to 51%</span>
        </div>

        {/* Hero Truemeds Savings Banner */}
        <div className="bg-gradient-to-r from-[#0d6e68] via-[#128983] to-[#1bb5ac] text-white p-6 sm:p-8 rounded-md shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#ffe500] text-[#0d6e68] text-[11px] font-black uppercase px-2.5 py-0.5 rounded-2xs">
              <Percent className="w-3.5 h-3.5 stroke-[3]" />
              <span>TRUEMEDS SMART MEDICINE ORDERING</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Upload Prescription & Save up to 51% on Medicines
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 font-medium leading-relaxed">
              Don&apos;t know the exact Ayurvedic medicine name? Simply upload your doctor&apos;s prescription. Our expert pharmacists will review your slip, map identical active bio-compounds, and deliver them to your doorstep.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0 bg-white/10 backdrop-blur-xs p-4 rounded-md border border-white/20 text-xs">
            <div className="flex items-center gap-2 font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-[#ffe500]" />
              <span>Triple-Check Pharmacist Audit</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-white">
              <Award className="w-4 h-4 text-[#ffe500]" />
              <span>100% NABL Heavy Metal Tested</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-white">
              <Truck className="w-4 h-4 text-[#ffe500]" />
              <span>Express Delivery in 24-48 Hours</span>
            </div>
          </div>
        </div>

        {/* Two Column Grid: Left Upload, Right How it works */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-md p-6 shadow-xs space-y-5">
            {isSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Prescription Received Successfully!
                </h3>
                <p className="text-xs text-slate-500">
                  Order Slip Ref: <span className="font-mono font-bold text-[#128983]">{rxOrderId}</span>
                </p>
                <div className="bg-teal-50 border border-teal-200 rounded-md p-4 text-left text-xs space-y-2">
                  <span className="font-bold text-[#0d6e68] block">Next Steps:</span>
                  <p className="text-slate-700">
                    Our licensed Vaidya / Pharmacist will call your phone at <span className="font-bold">{phone}</span> to confirm identical, budget-friendly classical alternatives before dispatch.
                  </p>
                </div>
                <Link
                  href="/"
                  className="inline-block bg-[#128983] text-white font-bold px-6 py-2.5 rounded-sm text-xs shadow-sm hover:bg-[#0d6e68]"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-base font-black text-slate-900">
                  Step 1: Upload Doctor&apos;s Prescription / Rx
                </h2>

                {/* Dropzone */}
                <div className="border-2 border-dashed border-teal-300 hover:border-teal-500 bg-teal-50/20 rounded-lg p-6 text-center space-y-3">
                  {previewUrl ? (
                    <div className="space-y-2">
                      <img
                        src={previewUrl}
                        alt="Prescription preview"
                        className="max-h-48 mx-auto rounded-md shadow-sm border border-slate-200"
                      />
                      <span className="text-xs font-bold text-emerald-700 block">
                        Prescription Photo Attached ✓
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-teal-100 text-[#128983] rounded-full flex items-center justify-center mx-auto">
                        <Camera className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        Click to select or drag & drop prescription image (JPG, PNG, PDF)
                      </p>
                    </>
                  )}

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <label className="bg-[#128983] hover:bg-[#0d6e68] text-white font-black text-xs px-4 py-2 rounded-sm cursor-pointer shadow-sm">
                      <span>{previewUrl ? 'Choose Different File' : 'Browse Files / Take Photo'}</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    {!previewUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewUrl(
                            'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'
                          )
                        }
                        className="border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold text-xs px-3 py-2 rounded-sm"
                      >
                        Try Sample Rx
                      </button>
                    )}
                  </div>
                </div>

                {/* Truemeds Preference */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-black text-slate-900 block">
                    Step 2: Choose Medicine Preference
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderPreference('substitute')}
                      className={`p-3 rounded-sm border text-left flex flex-col justify-between ${
                        orderPreference === 'substitute'
                          ? 'border-[#128983] bg-teal-50 ring-1 ring-[#128983]'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">
                          Recommend 51% Cheaper Substitutes
                        </span>
                        <span className="bg-[#ffe500] text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded-2xs">
                          SAVE MOST
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1">
                        Exact salt & active bio-compounds matched by pharmacists.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderPreference('exact')}
                      className={`p-3 rounded-sm border text-left flex flex-col justify-between ${
                        orderPreference === 'exact'
                          ? 'border-[#128983] bg-teal-50 ring-1 ring-[#128983]'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <span className="font-bold text-slate-900 text-xs">
                        Order Exact Brands Only
                      </span>
                      <span className="text-[11px] text-slate-500 mt-1">
                        Supply only the exact brand names written on the prescription.
                      </span>
                    </button>
                  </div>
                </div>

                {/* Phone & Pin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Mobile Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-slate-300 rounded-sm p-2 text-xs focus:outline-none focus:border-[#128983]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Delivery PIN Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="560001"
                      value={deliveryPin}
                      onChange={(e) => setDeliveryPin(e.target.value)}
                      className="w-full border border-slate-300 rounded-sm p-2 text-xs font-mono focus:outline-none focus:border-[#128983]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || (!selectedFile && !previewUrl)}
                  className="w-full bg-[#128983] hover:bg-[#0d6e68] disabled:bg-slate-300 text-white font-black py-3 rounded-sm text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? 'Uploading to Pharmacist...' : 'Submit Prescription & Save 51%'}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Truemeds Process & Guide */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#128983]" />
                <span>How Truemeds Prescription Ordering Works</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-[#128983] font-black flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">Upload Doctor&apos;s Prescription</div>
                    <p className="text-slate-500 text-[11px]">
                      Take a clear photo of your prescription slip showing patient name, doctor registration, and remedy list.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-[#128983] font-black flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">Pharmacist Triple-Check Audit</div>
                    <p className="text-slate-500 text-[11px]">
                      Our team matches chemical salts with 51% cheaper certified classical herbal extracts and rasayanas.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-[#128983] font-black flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">Doorstep Delivery with Savings</div>
                    <p className="text-slate-500 text-[11px]">
                      You get an SMS/WhatsApp cart link with confirmed savings. Pay via Razorpay, UPI, or Cash on Delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Valid Prescription Guide */}
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                <span>What makes a valid prescription?</span>
              </div>
              <ul className="text-slate-700 space-y-1 text-[11px] list-disc pl-5">
                <li>Doctor&apos;s name and medical registration number clearly visible</li>
                <li>Patient name and date of consultation</li>
                <li>Medicine dosage and frequency instructions</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
