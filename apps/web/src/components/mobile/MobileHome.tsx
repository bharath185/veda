'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  Sparkles,
  Camera,
  Mic,
  MapPin,
  Star,
  ShoppingCart,
  ChevronRight,
  Clock,
  ShieldCheck,
  User,
  Percent,
  TrendingDown,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { MobileBottomNav } from './MobileBottomNav';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { UploadPrescriptionModal } from '../prescription/UploadPrescriptionModal';

const chronicMobileConditions = [
  { name: 'Diabetes Care', icon: '🩸', slug: 'classical-rasayanas', discount: '51% Off' },
  { name: 'Cardiac & BP', icon: '❤️', slug: 'classical-rasayanas', discount: '48% Off' },
  { name: 'Joint Pain', icon: '🦴', slug: 'ayurvedic-thailams', discount: '53% Off' },
  { name: 'Gut & Acidity', icon: '🥣', slug: 'churnas-kwath', discount: '50% Off' },
  { name: 'Liver Detox', icon: '🌿', slug: 'churnas-kwath', discount: '55% Off' },
  { name: 'Stress & Sleep', icon: '🧠', slug: 'herbal-supplements', discount: '52% Off' },
  { name: 'Shilajit 24K', icon: '⚡', slug: 'herbal-supplements', discount: '51% Off' },
  { name: 'Skin & Glow', icon: '✨', slug: 'botanical-skincare', discount: '47% Off' },
];

const mobileProducts = [
  {
    id: 'm-1',
    title: 'Swarna Bhasma Chyawanprash (1kg)',
    slug: 'swarna-bhasma-chyawanprash-1kg',
    price: 1499,
    compareAtPrice: 1799,
    discountPct: 17,
    rating: 4.8,
    reviews: 1420,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'm-2',
    title: 'Pure Himalayan Shilajit Resin (20g)',
    slug: 'pure-himalayan-shilajit-resin-20g',
    price: 1299,
    compareAtPrice: 1699,
    discountPct: 23,
    rating: 4.9,
    reviews: 2180,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'm-3',
    title: 'KSM-66 Organic Ashwagandha (60 caps)',
    slug: 'ksm66-organic-ashwagandha-capsules',
    price: 799,
    compareAtPrice: 999,
    discountPct: 20,
    rating: 4.7,
    reviews: 954,
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'm-4',
    title: 'Kashmiri Saffron Kumkumadi Oil (30ml)',
    slug: 'kashmiri-saffron-kumkumadi-night-oil',
    price: 1299,
    compareAtPrice: 1699,
    discountPct: 23,
    rating: 4.8,
    reviews: 840,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
  },
];

export function MobileHome() {
  const [search, setSearch] = useState('');
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const { addItem } = useCartStore();
  const { user, isLoggedIn, checkAuth } = useAuthStore();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const displayName = user?.name ? user.name.split(' ')[0] : 'Customer';

  return (
    <div className="min-h-screen bg-[#f1f2f4] pb-20 flex flex-col text-slate-800 font-sans">
      {/* Truemeds Style Top Ribbon */}
      <div className="bg-[#0b5c57] text-white text-[10px] font-bold py-1 px-3 flex items-center justify-between border-b border-teal-800">
        <span className="flex items-center gap-1">
          <span className="bg-[#ffe500] text-slate-900 text-[8px] font-black px-1 rounded-2xs">TRUEMEDS</span>
          <span>Save up to 51% on Medicines</span>
        </span>
        <span className="text-teal-200 text-[9px]">Triple-Check Guarantee</span>
      </div>

      {/* Truemeds Mobile Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#128983] text-white p-3 space-y-2.5 shadow-sm">
        {/* Brand & Account Row */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1">
            <span className="font-black italic text-lg tracking-tight text-white">
              Veda<span className="text-[#ffe500]">Flow</span>
            </span>
            <span className="text-[9px] bg-[#0b5c57] text-[#ffe500] border border-teal-400/30 font-black px-1 rounded-xs uppercase">
              RX SAVINGS
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <div className="flex items-center gap-1.5 text-xs font-black bg-white/20 text-white px-2.5 py-1 rounded-xs border border-white/30 backdrop-blur-xs">
                <User className="w-3.5 h-3.5" />
                <span>{displayName}</span>
              </div>
            ) : (
              <Link href="/login" className="text-xs font-bold bg-white text-[#128983] px-3 py-1 rounded-xs shadow-xs">
                Login
              </Link>
            )}
            <Bell className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center bg-white rounded-xs px-3 py-2 text-slate-800 shadow-inner">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search medicine, salt or herbal extract..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-medium focus:outline-none bg-transparent placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={() => setIsRxModalOpen(true)}
            className="text-[#128983] hover:text-[#0b5c57] ml-2 shrink-0"
            title="Upload Prescription"
          >
            <Camera className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Delivery Pin Strip */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-teal-100">
          <MapPin className="w-3.5 h-3.5 text-[#ffe500]" />
          <span>Deliver to Bengaluru 560001 (Ekart EV)</span>
          <ChevronRight className="w-3 h-3 ml-auto text-teal-200" />
        </div>
      </header>

      {/* Truemeds Signature Quick Prescription Card on Mobile */}
      <div className="mx-2 mt-2 bg-gradient-to-r from-[#0d6e68] to-[#128983] text-white p-3.5 rounded-sm shadow-xs flex items-center justify-between gap-3">
        <div className="space-y-0.5 max-w-[65%]">
          <span className="bg-[#ffe500] text-[#0d6e68] text-[8px] font-black uppercase px-1.5 py-0.2 rounded-2xs">
            SAVE UP TO 51%
          </span>
          <h3 className="text-xs font-black leading-snug">
            Order Medicine With Prescription
          </h3>
          <p className="text-[10px] text-teal-100">
            Pharmacists match 51% cheaper classical alternatives.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsRxModalOpen(true)}
          className="bg-[#ffe500] hover:bg-[#ebd300] text-slate-900 font-black text-xs px-3 py-2 rounded-xs shadow-sm flex items-center gap-1 shrink-0"
        >
          <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Upload Rx</span>
        </button>
      </div>

      {/* Chronic Health Conditions Circle Scroller */}
      <div className="bg-white py-3 px-2 border-b border-slate-200 mt-2 overflow-x-auto flex gap-3 scrollbar-none">
        {chronicMobileConditions.map((c) => (
          <Link
            key={c.name}
            href={`/categories/${c.slug}`}
            className="flex flex-col items-center shrink-0 w-16 text-center space-y-1"
          >
            <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-xl shadow-xs">
              {c.icon}
            </div>
            <span className="text-[10px] font-bold text-slate-800 leading-tight">
              {c.name}
            </span>
            <span className="text-[8px] bg-emerald-100 text-emerald-800 font-black px-1 rounded-2xs">
              {c.discount}
            </span>
          </Link>
        ))}
      </div>

      {/* Truemeds Smart Substitute Card for Mobile */}
      <div className="mx-2 mt-2 bg-white border border-slate-200 rounded-sm p-3 space-y-2 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="bg-[#128983] text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-2xs">
            SMART SUBSTITUTE
          </span>
          <span className="text-[10px] font-black text-emerald-700">Save 51%</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-red-50 p-2 rounded-xs border border-red-100 space-y-0.5">
            <span className="text-[9px] text-red-700 font-bold">Commercial Drug</span>
            <div className="font-bold text-slate-800 text-[11px] line-clamp-1">Multivitamin Pill</div>
            <div className="text-sm font-black text-slate-900">₹980</div>
          </div>

          <div className="bg-emerald-50 p-2 rounded-xs border border-emerald-200 space-y-0.5">
            <span className="text-[9px] text-emerald-700 font-bold">Classical Remedy</span>
            <div className="font-bold text-slate-900 text-[11px] line-clamp-1">Swarna Chyawanprash</div>
            <div className="text-sm font-black text-emerald-800">₹479</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            addItem({
              id: 'swarna-chyawanprash-1kg',
              productId: 'swarna-chyawanprash-1kg',
              variantId: 'swarna-chyawanprash-1kg',
              sku: 'swarna-chyawanprash-1kg',
              title: 'Swarna Bhasma Amrit Chyawanprash (1kg)',
              price: 479,
              image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80',
              quantity: 1,
            })
          }
          className="w-full bg-[#128983] text-white text-[10px] font-black py-2 rounded-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-xs"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Switch & Save ₹501 Today</span>
        </button>
      </div>

      {/* Product Grid */}
      <div className="p-2 space-y-2">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
            NABL Lab Certified Formulations
          </h4>
          <span className="text-xs font-bold text-[#128983]">View All</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {mobileProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-xs p-2.5 flex flex-col justify-between shadow-xs"
            >
              <Link href={`/products/${p.slug}`} className="h-32 flex items-center justify-center mb-1">
                <img src={p.image} alt={p.title} className="max-h-full object-contain" />
              </Link>

              <div className="space-y-1">
                <Link
                  href={`/products/${p.slug}`}
                  className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight block h-7"
                >
                  {p.title}
                </Link>

                <div className="flex items-center gap-1">
                  <span className="bg-[#388e3c] text-white text-[9px] font-black px-1 py-0.5 rounded-2xs flex items-center gap-0.5">
                    <span>{p.rating}</span>
                    <Star className="w-2 h-2 fill-white" />
                  </span>
                  <span className="text-[9px] text-slate-400">({p.reviews})</span>
                  <span className="ml-auto text-[8px] bg-[#128983] text-white font-black italic px-0.5 rounded-2xs">
                    Veda<span className="text-[#ffe500]">✓</span>
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 pt-0.5">
                  <span className="text-xs font-black text-slate-900">
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">
                    ₹{p.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-bold text-[#388e3c]">
                    {p.discountPct}% off
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      id: p.id,
                      productId: p.id,
                      variantId: p.id,
                      sku: p.id,
                      title: p.title,
                      price: p.price,
                      image: p.image,
                      quantity: 1,
                    })
                  }
                  className="w-full bg-[#128983] hover:bg-[#0b5c57] text-white text-[10px] font-black py-1.5 rounded-2xs uppercase tracking-wider mt-1"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Truemeds Triple-Check Guarantee Bar */}
      <div className="mx-2 my-2 bg-white p-3 rounded-xs border border-slate-200 flex items-center justify-around text-center text-[10px] font-bold text-slate-600">
        <div>🩺 Pharmacist Audit</div>
        <div>·</div>
        <div>🛡️ 100% NABL Tested</div>
        <div>·</div>
        <div>⚡ Save 51%</div>
      </div>

      {/* Bottom Nav */}
      <MobileBottomNav />

      {/* Prescription Modal */}
      <UploadPrescriptionModal
        isOpen={isRxModalOpen}
        onClose={() => setIsRxModalOpen(false)}
      />
    </div>
  );
}
