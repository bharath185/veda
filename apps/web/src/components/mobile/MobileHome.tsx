'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Sparkles, Download, Star, Plus, Leaf, ShieldCheck } from 'lucide-react';
import { MobileBottomNav } from './MobileBottomNav';
import { useCartStore } from '../../store/useCartStore';

const mobileAyurvedaCategories = [
  { name: 'Rasayana', icon: '🍯', slug: 'classical-rasayanas' },
  { name: 'Shilajit', icon: '⛰️', slug: 'herbal-supplements' },
  { name: 'Ashwagandha', icon: '🌿', slug: 'herbal-supplements' },
  { name: 'Thailam', icon: '🪔', slug: 'ayurvedic-thailams' },
  { name: 'Kumkumadi', icon: '✨', slug: 'botanical-skincare' },
  { name: 'Triphala', icon: '🍃', slug: 'churnas-kwath' },
  { name: 'Gut Tonic', icon: '🌱', slug: 'digestive-gut-health' },
  { name: 'Herbal Tea', icon: '🍵', slug: 'wellness-herbal-teas' },
];

const mobileProducts = [
  {
    id: 'm-1',
    title: 'Swarna Bhasma Chyawanprash (1kg)',
    slug: 'swarna-bhasma-chyawanprash-1kg',
    price: 1499,
    compareAtPrice: 1799,
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'm-2',
    title: 'Pure Himalayan Shilajit Resin (20g)',
    slug: 'pure-himalayan-shilajit-resin-20g',
    price: 1299,
    compareAtPrice: 1699,
    rating: 4.98,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'm-3',
    title: 'KSM-66 Organic Ashwagandha (60 caps)',
    slug: 'ksm66-organic-ashwagandha-capsules',
    price: 799,
    compareAtPrice: 999,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'm-4',
    title: 'Kashmiri Saffron Kumkumadi Oil (30ml)',
    slug: 'kashmiri-saffron-kumkumadi-night-oil',
    price: 1299,
    compareAtPrice: 1699,
    rating: 4.92,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
  },
];

export function MobileHome() {
  const [showPwaBanner, setShowPwaBanner] = useState(true);
  const { addItem } = useCartStore();

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24 flex flex-col text-slate-800">
      {/* Mobile Sticky Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 px-4 py-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black">
              <Leaf className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <span className="font-black text-lg text-slate-900 tracking-tight">VedaFlow</span>
              <span className="block text-[9px] font-extrabold text-emerald-700 tracking-wider uppercase">Ayurveda Pure</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-emerald-50 text-slate-600">
              <Bell className="w-4 h-4 text-emerald-800" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Ashwagandha, Shilajit, Chyawanprash..."
            className="w-full bg-slate-50 border border-emerald-100 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>
      </header>

      {/* AYUSH Certified Banner */}
      {showPwaBanner && (
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-4 py-2.5 flex items-center justify-between text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>100% Non-Pharma Herbal Medicine · AYUSH Premium Certified</span>
          </div>
          <button
            onClick={() => setShowPwaBanner(false)}
            className="text-white/80 hover:text-white font-bold ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Category Pills (Horizontal Scroll) */}
      <div className="overflow-x-auto no-scrollbar py-3 px-4 flex gap-3 bg-white border-b border-emerald-50">
        {mobileAyurvedaCategories.map((c) => (
          <Link
            key={c.name}
            href={`/categories/${c.slug}`}
            className="flex flex-col items-center gap-1 min-w-[64px] active:scale-95 transition-transform"
          >
            <div className="w-13 h-13 rounded-2xl bg-emerald-50/80 flex items-center justify-center text-xl shadow-xs border border-emerald-100/60">
              {c.icon}
            </div>
            <span className="text-[11px] font-bold text-slate-700 tracking-tight">{c.name}</span>
          </Link>
        ))}
      </div>

      {/* Featured Botanical Hero Card */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-emerald-950 to-teal-900 rounded-3xl p-5 text-white relative overflow-hidden shadow-lg">
          <div className="space-y-2 z-10 relative">
            <span className="inline-flex items-center gap-1 bg-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              <Leaf className="w-3 h-3 text-amber-300" /> Rasayana of Kings
            </span>
            <h2 className="text-xl font-black">Swarna Chyawanprash</h2>
            <p className="text-xs text-stone-300">Wild forest Amla with 24K Gold Bhasma</p>
            <Link
              href="/products/swarna-bhasma-chyawanprash-1kg"
              className="inline-block mt-2 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl active:bg-emerald-700 shadow"
            >
              Order Classical Formula
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&auto=format&fit=crop&q=80"
            alt="Hero Herbal"
            className="absolute -right-4 -bottom-4 w-36 h-36 object-cover rounded-2xl opacity-60"
          />
        </div>
      </div>

      {/* 2-Column Mobile Product Grid */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900">Classical Formulations</h3>
          <span className="text-xs font-bold text-emerald-700">View All</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {mobileProducts.map((p) => {
            const discount = p.compareAtPrice
              ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
              : 0;

            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-emerald-100 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div className="relative aspect-square bg-emerald-50/50">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-emerald-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                      {discount}% OFF
                    </span>
                  )}
                </div>

                <div className="p-3 space-y-1.5">
                  <Link href={`/products/${p.slug}`} className="font-bold text-xs text-slate-900 line-clamp-1">
                    {p.title}
                  </Link>

                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                    <span>{p.rating}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="text-xs font-black text-slate-900">₹{p.price.toLocaleString('en-IN')}</div>
                    </div>
                    <button
                      onClick={() =>
                        addItem({
                          id: `cart-${p.id}`,
                          variantId: `var-${p.id}`,
                          productId: p.id,
                          title: p.title,
                          sku: `VD-${p.slug.toUpperCase().slice(0, 8)}`,
                          price: p.price,
                          quantity: 1,
                          image: p.image,
                        })
                      }
                      className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center active:scale-90 transition-transform shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}
