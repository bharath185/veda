'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Leaf, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

const categories = [
  { name: 'Classical Rasayanas & Chyawanprash', slug: 'classical-rasayanas' },
  { name: 'Herbal Supplements & Shilajit', slug: 'herbal-supplements' },
  { name: 'Organic Churnas & Single Herbs', slug: 'churnas-kwath' },
  { name: 'Medicated Thailams & Pain Oils', slug: 'ayurvedic-thailams' },
  { name: 'Ayurvedic Botanical Skincare', slug: 'botanical-skincare' },
  { name: 'Hair Tonics & Bhringraj Care', slug: 'hair-nourishment' },
  { name: 'Digestive & Gut Health Tonics', slug: 'digestive-gut-health' },
  { name: 'Immunity Kadhas & Tulsi Drops', slug: 'immunity-kadhas' },
  { name: 'Mind, Sleep & Stress Tonics', slug: 'stress-sleep-tonics' },
  { name: 'Detox Herbal Teas & Infusions', slug: 'wellness-herbal-teas' },
];

export function DesktopHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const { items, setIsOpen } = useCartStore();
  const totalItemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-emerald-100">
      {/* Top Botanical Banner */}
      <div className="bg-emerald-800 text-emerald-50 text-xs font-semibold py-1.5 px-4 text-center tracking-wide flex justify-center items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>100% Non-Pharma Herbal Medicine · AYUSH Certified · Use coupon <strong>HERBAL20</strong> for 20% off</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
              Veda<span className="text-emerald-600">Flow</span>
            </span>
            <span className="block text-[10px] uppercase font-extrabold text-emerald-700 tracking-wider">
              Ayurveda & Herbal Wellness
            </span>
          </div>
        </Link>

        {/* Categories Mega Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setShowMegaMenu(true)}
          onMouseLeave={() => setShowMegaMenu(false)}
        >
          <button className="px-3.5 py-2 text-sm font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1.5 transition-colors rounded-xl hover:bg-emerald-50/60">
            <span>Ayurvedic Remedies</span>
            <span className="text-xs text-emerald-600">▾</span>
          </button>

          {showMegaMenu && (
            <div className="absolute top-full left-0 w-88 bg-white rounded-2xl shadow-2xl border border-emerald-100 p-4 grid grid-cols-1 gap-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider px-3 py-1 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" /> Classical Formulations
              </div>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all flex items-center justify-between"
                >
                  {cat.name}
                  <span className="text-emerald-400">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar with Cmd+K */}
        <div className="flex-1 max-w-xl relative">
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-600 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Ashwagandha, Shilajit, Chyawanprash, Kumkumadi... (Press ⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 hover:bg-white border border-emerald-200/80 focus:border-emerald-500 focus:bg-white rounded-full pl-11 pr-16 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all font-medium"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold bg-white border border-slate-200 text-slate-500 rounded px-1.5 py-0.5 shadow-sm">
              ⌘K
            </div>
          </div>
        </div>

        {/* Right Nav Icons, Auth & Dashboards */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-bold text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white px-3.5 py-2 rounded-xl shadow-sm transition-all"
          >
            Register
          </Link>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          <Link
            href="http://localhost:3001"
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Vaidya Admin
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2.5 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors ml-1"
            title="Open Cart"
          >
            <ShoppingBag className="w-5 h-5 text-emerald-800" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center animate-bounce shadow">
                {totalItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
