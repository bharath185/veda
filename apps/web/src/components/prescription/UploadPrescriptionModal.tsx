'use client';

import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  Camera,
  CheckCircle2,
  ShieldCheck,
  PhoneCall,
  Clock,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface UploadPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadPrescriptionModal({ isOpen, onClose }: UploadPrescriptionModalProps) {
  const { user } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [phone, setPhone] = useState(user?.phone || '');
  const [deliveryPin, setDeliveryPin] = useState('560001');
  const [orderPreference, setOrderPreference] = useState<'substitute' | 'exact'>('substitute');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rxOrderId, setRxOrderId] = useState<string>('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
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

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Truemeds Style Teal & Navy Header */}
        <div className="bg-gradient-to-r from-[#0d6e68] via-[#128983] to-[#1bb5ac] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#ffe500] text-[#0d6e68] text-[10px] font-black uppercase px-2 py-0.5 rounded-2xs tracking-wider">
                SAVE UP TO 51%
              </span>
              <span className="text-[11px] font-bold text-teal-100 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ffe500]" /> Triple-Check Pharmacist Audit
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight leading-snug">
              Upload Prescription (Rx)
            </h3>
            <p className="text-xs text-teal-100">
              Our registered pharmacists will find 100% composition-matched classical herbal remedies to save you money.
            </p>
          </div>

          <button
            onClick={resetForm}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-900">
                Prescription Uploaded Successfully!
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Reference ID: <span className="font-mono font-bold text-[#128983]">{rxOrderId}</span>
              </p>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-md p-4 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex items-center gap-2 font-black text-[#0d6e68]">
                <Clock className="w-4 h-4 text-[#128983]" />
                <span>What Happens Next? (Truemeds Process)</span>
              </div>
              <ul className="space-y-1.5 text-slate-700 pl-5 list-disc marker:text-[#128983]">
                <li>Our licensed Vaidya / Pharmacist is reviewing your prescription now.</li>
                <li>You will receive a WhatsApp/SMS alert with recommended classical substitutes that save up to 51%.</li>
                <li>Your order will be dispatched via Ekart EV logistics to PIN <span className="font-bold text-slate-900">{deliveryPin}</span>.</li>
              </ul>
            </div>

            <button
              onClick={resetForm}
              className="bg-[#128983] hover:bg-[#0d6e68] text-white font-bold px-6 py-2.5 rounded-sm text-xs transition-colors shadow-sm"
            >
              Back to Storefront
            </button>
          </div>
        ) : (
          /* Upload Form */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans">
            {/* Dropzone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                previewUrl
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-teal-300 hover:border-teal-500 bg-teal-50/20'
              }`}
            >
              {previewUrl ? (
                <div className="space-y-3">
                  <div className="relative inline-block max-w-[200px] max-h-[160px] overflow-hidden rounded-md border border-slate-300 shadow-sm">
                    <img
                      src={previewUrl}
                      alt="Prescription preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{selectedFile?.name || 'Prescription image selected'}</span>
                  </div>
                  <label className="text-[11px] font-bold text-[#128983] hover:underline cursor-pointer block">
                    <span>Change Image</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 bg-teal-100 text-[#128983] rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <UploadCloud className="w-7 h-7 stroke-[2.2]" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">
                      Drag & drop your doctor prescription here
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Supports JPG, PNG, WebP, or PDF up to 10MB
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-1">
                    <label className="bg-[#128983] hover:bg-[#0d6e68] text-white font-black text-xs px-4 py-2 rounded-sm cursor-pointer shadow-sm transition-colors flex items-center gap-1.5">
                      <Camera className="w-4 h-4" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        // Quick demo prescription
                        setPreviewUrl('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80');
                      }}
                      className="text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 font-bold text-xs px-3 py-2 rounded-sm transition-colors"
                    >
                      Use Sample Rx
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Substitution Preference (Truemeds Core USP) */}
            <div className="bg-slate-50 border border-slate-200 rounded-md p-3 space-y-2">
              <span className="font-black text-slate-800 block text-[11px] uppercase tracking-wider">
                Choose Your Savings Preference:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label
                  onClick={() => setOrderPreference('substitute')}
                  className={`p-2.5 rounded-sm border cursor-pointer flex flex-col justify-between transition-all ${
                    orderPreference === 'substitute'
                      ? 'border-[#128983] bg-teal-50 ring-1 ring-[#128983]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">
                      Recommend 51% Cheaper Substitutes
                    </span>
                    <span className="bg-[#ffe500] text-slate-900 text-[9px] font-black px-1.5 py-0.2 rounded-2xs">
                      POPULAR
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Our pharmacist will replace overpriced chemical brands with exact composition classical formulations.
                  </p>
                </label>

                <label
                  onClick={() => setOrderPreference('exact')}
                  className={`p-2.5 rounded-sm border cursor-pointer flex flex-col justify-between transition-all ${
                    orderPreference === 'exact'
                      ? 'border-[#128983] bg-teal-50 ring-1 ring-[#128983]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="font-bold text-slate-900 text-xs">
                    Order Exactly as Written
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Deliver only the exact brand names specified on the doctor prescription slip.
                  </p>
                </label>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mobile Number for WhatsApp Confirmation *</label>
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
                <label className="font-bold text-slate-700">Delivery PIN Code *</label>
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

            {/* Truemeds Trust Bullet */}
            <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-sm text-amber-900 text-[11px] font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>100% Prescription Privacy:</strong> Encrypted under HIPAA/DISHA guidelines. Our pharmacist will call you before dispatch to confirm remedies.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-200">
              <button
                type="button"
                onClick={resetForm}
                className="text-slate-500 hover:text-slate-800 font-bold px-3 py-2 text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || (!selectedFile && !previewUrl)}
                className="bg-[#128983] hover:bg-[#0d6e68] disabled:bg-slate-300 text-white font-black px-6 py-2.5 rounded-sm text-xs shadow-md flex items-center gap-2 transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <span>Processing Prescription...</span>
                ) : (
                  <>
                    <span>Confirm & Upload Rx</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
