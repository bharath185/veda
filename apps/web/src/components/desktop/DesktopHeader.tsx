'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Heart, User, Sparkles, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

const categories = [
  { name: 'Smartphones & Accessories', slug: 'smartphones-accessories' },
  { name: 'Laptops & Computing', slug: 'laptops-computing' },
  { name: 'Audio & Hi-Fi', slug: 'audio-headphones' },
  { name: 'Smart Wearables', slug: 'smart-wearables' },
  { name: 'Men Fashion', slug: 'men-fashion' },
  { name: 'Women Fashion', slug: 'women-fashion' },
  { name: 'Smart Living', slug: 'home-smart-living' },
  { name: 'Fitness & Sports', slug: 'fitness-sports' },
];

export function DesktopHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const { items, setIsOpen } = useCartStore();
  const totalItemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner */}
      <div className="bg-indigo-600 text-white text-xs font-medium py-1.5 px-4 text-center tracking-wide flex justify-center items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>Grand Launch: Extra 20% off with coupon <strong>SUPERFEST20</strong> + Free Express Delivery</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              Shop<span className="text-indigo-600">Flow</span>
            </span>
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Enterprise Store</span>
          </div>
        </Link>

        {/* Categories Mega Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setShowMegaMenu(true)}
          onMouseLeave={() => setShowMegaMenu(false)}
        >
          <button className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 flex items-center gap-1.5 transition-colors">
            Categories
            <span className="text-xs">▾</span>
          </button>

          {showMegaMenu && (
            <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 grid grid-cols-1 gap-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-1">Explore Departments</div>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-between"
                >
                  {cat.name}
                  <span className="text-slate-300">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar with Cmd+K */}
        <div className="flex-1 max-w-xl relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 50+ curated products, brands, or categories... (Press ⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/80 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-full pl-11 pr-16 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold bg-white border border-slate-200 text-slate-500 rounded px-1.5 py-0.5 shadow-sm">
              ⌘K
            </div>
          </div>
        </div>

        {/* Right Nav Icons & Dashboards */}
        <div className="flex items-center gap-4">
          <Link
            href="http://localhost:3001"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Admin Portal
          </Link>
          <Link
            href="http://localhost:3002"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Delivery App
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-indigo-600 transition-colors"
            title="Open Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center animate-bounce">
                {totalItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
