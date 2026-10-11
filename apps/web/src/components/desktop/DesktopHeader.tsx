'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  ChevronDown,
  Sparkles,
  User,
  Package,
  Heart,
  Award,
  HelpCircle,
  Bell,
  Download,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

const flipkartCategories = [
  { name: 'Classical Rasayanas', slug: 'classical-rasayanas', icon: '🍯' },
  { name: 'Pure Shilajit & Resins', slug: 'herbal-supplements', icon: '⚡' },
  { name: 'Ashwagandha & Vitality', slug: 'herbal-supplements', icon: '🌿' },
  { name: 'Organic Churnas', slug: 'churnas-kwath', icon: '🥣' },
  { name: 'Medicated Thailams', slug: 'ayurvedic-thailams', icon: '🧴' },
  { name: 'Kumkumadi & Glow', slug: 'botanical-skincare', icon: '✨' },
  { name: 'Bhringraj Hair Care', slug: 'hair-nourishment', icon: '💇‍♀️' },
  { name: 'Gut & Digestion', slug: 'digestive-gut-health', icon: '🩺' },
  { name: 'Immunity Kadhas', slug: 'immunity-kadhas', icon: '🍵' },
  { name: 'Herbal Deals', slug: 'all-deals', icon: '🏷️' },
];

export function DesktopHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { items, setIsOpen } = useCartStore();
  const totalItemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* 1. Flipkart Primary Blue Header Bar */}
      <div className="bg-[#2874f0] text-white">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Flipkart Style Logo + Plus */}
          <Link href="/" className="flex flex-col items-start leading-none group shrink-0">
            <div className="flex items-center gap-1">
              <span className="text-xl font-black italic tracking-tight text-white">
                Veda<span className="text-[#ffe500]">Flow</span>
              </span>
              <span className="text-[10px] bg-[#ffe500] text-[#2874f0] font-black px-1 rounded-sm uppercase tracking-tighter">
                AYUSH
              </span>
            </div>
            <div className="flex items-center gap-0.5 text-[11px] font-bold italic text-slate-200 hover:underline">
              <span>Explore</span>
              <span className="text-[#ffe500] font-black ml-0.5">Plus</span>
              <Sparkles className="w-2.5 h-2.5 text-[#ffe500] inline fill-[#ffe500]" />
            </div>
          </Link>

          {/* Flipkart Style Search Box */}
          <div className="flex-1 max-w-2xl relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search for Ayurvedic medicines, Rasayanas, Shilajit, Ashwagandha and brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-900 placeholder:text-slate-500 text-xs px-4 py-2.5 rounded-sm shadow-inner focus:outline-none focus:ring-1 focus:ring-amber-300 font-medium"
              />
              <button
                type="button"
                className="absolute right-0 top-0 bottom-0 px-4 bg-white text-[#2874f0] hover:text-[#1c55b5] flex items-center justify-center rounded-r-sm transition-colors"
                title="Search"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-6 shrink-0 text-sm font-bold">
            {/* Login Button with Flipkart Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowLoginMenu(true)}
              onMouseLeave={() => setShowLoginMenu(false)}
            >
              <Link
                href="/login"
                className="bg-white text-[#2874f0] hover:bg-slate-50 px-7 py-1 text-xs font-black rounded-sm shadow-sm transition-colors flex items-center gap-1"
              >
                Login
              </Link>

              {/* Login Dropdown */}
              {showLoginMenu && (
                <div className="absolute top-full -left-6 w-60 bg-white text-slate-800 rounded-sm shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in duration-100">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">New Customer?</span>
                    <Link href="/register" className="text-xs font-black text-[#2874f0] hover:underline">
                      Sign Up
                    </Link>
                  </div>
                  <Link
                    href="/login"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    <User className="w-4 h-4 text-[#2874f0]" />
                    <span>My Ayurvedic Profile</span>
                  </Link>
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    <Sparkles className="w-4 h-4 text-[#ffe500] fill-[#ffe500]" />
                    <span>Veda Plus Zone</span>
                  </Link>
                  <Link
                    href="/checkout"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    <Package className="w-4 h-4 text-[#2874f0]" />
                    <span>Remedy Orders</span>
                  </Link>
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    <Heart className="w-4 h-4 text-[#2874f0]" />
                    <span>Wishlist (Herbal Remedies)</span>
                  </Link>
                  <Link
                    href="http://localhost:3001"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700 border-t border-slate-100"
                  >
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Vaidya Doctor Portal</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Become a Seller / Ayurvedic Clinic */}
            <Link
              href="http://localhost:3001"
              className="text-xs font-bold text-white hover:text-amber-200 transition-colors whitespace-nowrap"
            >
              Become a Seller
            </Link>

            {/* More Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowMoreMenu(true)}
              onMouseLeave={() => setShowMoreMenu(false)}
            >
              <button className="flex items-center gap-1 text-xs font-bold text-white hover:text-amber-200 transition-colors">
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showMoreMenu && (
                <div className="absolute top-full -left-10 w-56 bg-white text-slate-800 rounded-sm shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in duration-100">
                  <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700">
                    <Bell className="w-4 h-4 text-[#2874f0]" />
                    <span>Notification Preferences</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700">
                    <HelpCircle className="w-4 h-4 text-[#2874f0]" />
                    <span>24x7 Vaidya Care</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>AYUSH Quality Certificates</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700">
                    <Download className="w-4 h-4 text-[#2874f0]" />
                    <span>Download VedaFlow App</span>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 text-xs font-black text-white hover:text-amber-200 transition-colors relative"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ffe500] text-[#2874f0] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {totalItemCount}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Flipkart Signature White Category Strip with Icons */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto py-2.5 gap-2 scrollbar-none">
          {flipkartCategories.map((cat) => (
            <Link
              key={cat.name}
              href={`/categories/${cat.slug}`}
              className="flex flex-col items-center group text-center shrink-0 px-2 py-1 hover:text-[#2874f0] transition-colors"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-[11px] font-bold text-slate-800 group-hover:text-[#2874f0] mt-1 whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
