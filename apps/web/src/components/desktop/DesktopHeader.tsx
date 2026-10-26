'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  LogOut,
  Tag,
  Coins,
  Camera,
  FileText,
  Percent,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { UploadPrescriptionModal } from '../prescription/UploadPrescriptionModal';

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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);

  const { items, setIsOpen } = useCartStore();
  const { user, isLoggedIn, checkAuth, logout } = useAuthStore();
  const totalItemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  // Sync auth state on mount and listen to storage events
  useEffect(() => {
    checkAuth();
    const handleAuthChange = () => checkAuth();
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('shopflow_auth_change', handleAuthChange);
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('shopflow_auth_change', handleAuthChange);
    };
  }, [checkAuth]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.refresh();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/categories?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Get user display name (first name)
  const displayName = user?.name ? user.name.split(' ')[0] : 'My Account';

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* 0. Truemeds Style Signature Top Savings Ribbon */}
      <div className="bg-[#0b5c57] text-white text-[11px] font-bold py-1.5 px-4 border-b border-teal-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#ffe500] text-slate-900 text-[9px] font-black uppercase px-1.5 py-0.2 rounded-2xs tracking-wider">
              TRUEMEDS SMART SAVINGS
            </span>
            <span className="truncate">
              ⚡ Save up to 51% on genuine medicines with Triple-Check Quality Guarantee | Flat 25% OFF with code <strong className="text-[#ffe500]">FIRST25</strong>
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-[10px] text-teal-100 shrink-0">
            <span>🚚 Free Delivery &gt; ₹499</span>
            <span>•</span>
            <span>🛡️ 100% NABL Lab Tested</span>
            <span>•</span>
            <span>🩺 Pharmacist Verified</span>
          </div>
        </div>
      </div>

      {/* 1. Primary Header Bar */}
      <div className="bg-[#128983] text-white">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo with Truemeds Savings tagline */}
          <Link href="/" className="flex flex-col items-start leading-none group shrink-0">
            <div className="flex items-center gap-1">
              <span className="text-xl font-black italic tracking-tight text-white">
                Veda<span className="text-[#ffe500]">Flow</span>
              </span>
              <span className="text-[9px] bg-[#0b5c57] text-[#ffe500] border border-teal-400/30 font-black px-1 rounded-sm uppercase tracking-tighter">
                E-PHARMACY
              </span>
            </div>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-teal-100 hover:text-white mt-0.5">
              <span>Save up to</span>
              <span className="text-[#ffe500] font-black ml-0.5">51% on Rx</span>
              <Sparkles className="w-2.5 h-2.5 text-[#ffe500] inline fill-[#ffe500]" />
            </div>
          </Link>

          {/* Truemeds Style Smart Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search by Medicine Name, Salt / Composition, or Herbal Extract..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-900 placeholder:text-slate-500 text-xs pl-3.5 pr-9 py-2 rounded-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-[#ffe500] font-medium"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-3 bg-white text-[#128983] hover:text-[#0b5c57] flex items-center justify-center rounded-r-sm transition-colors"
                title="Search"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>

          {/* Truemeds Signature "Upload Rx" Button */}
          <button
            type="button"
            onClick={() => setIsRxModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 bg-[#ffe500] hover:bg-[#edd400] text-slate-900 font-black px-3 py-1.5 text-xs rounded-sm shadow-sm transition-transform active:scale-95 shrink-0"
            title="Upload Prescription & Save up to 51%"
          >
            <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Upload Rx</span>
            <span className="bg-[#0b5c57] text-[#ffe500] text-[9px] font-black px-1 rounded-2xs">
              51% OFF
            </span>
          </button>

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0 text-sm font-bold">
            {/* User Account / Login Button */}
            <div
              className="relative"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              {isLoggedIn ? (
                /* Authenticated User Pill (Flipkart style: Name with down arrow) */
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs font-black text-white hover:text-amber-200 transition-colors py-1 px-2 rounded-xs"
                >
                  <User className="w-4 h-4 fill-white text-white" />
                  <span>{displayName}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              ) : (
                /* Unauthenticated Login Button (Flipkart style: White button) */
                <Link
                  href="/login"
                  className="bg-white text-[#2874f0] hover:bg-slate-50 px-7 py-1 text-xs font-black rounded-sm shadow-sm transition-colors flex items-center gap-1"
                >
                  Login
                </Link>
              )}

              {/* Account / Login Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute top-full -left-10 w-64 bg-white text-slate-800 rounded-sm shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in duration-100">
                  {isLoggedIn ? (
                    <>
                      {/* Customer Greeting Header */}
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Signed in as Customer
                        </div>
                        <div className="text-xs font-black text-slate-900 truncate">
                          {user?.name || 'Customer'}
                        </div>
                        <div className="text-[11px] font-medium text-slate-500 truncate">
                          {user?.phone || user?.email || '+91 98765 43210'}
                        </div>
                      </div>

                      {/* Menu Links */}
                      <Link
                        href="/checkout"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                      >
                        <Package className="w-4 h-4 text-[#2874f0]" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        href="/categories"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                      >
                        <Sparkles className="w-4 h-4 text-[#ffe500] fill-[#ffe500]" />
                        <span>SuperCoins Zone (150 Coins)</span>
                      </Link>

                      <Link
                        href="/categories"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                      >
                        <Heart className="w-4 h-4 text-[#2874f0]" />
                        <span>Wishlist</span>
                      </Link>

                      <Link
                        href="/categories"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                      >
                        <Tag className="w-4 h-4 text-[#388e3c]" />
                        <span>My Coupons</span>
                      </Link>

                      {/* Logout Action */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-xs font-bold text-red-600 border-t border-slate-100 text-left transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Logged Out View */}
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
                        <span>My Profile</span>
                      </Link>
                      <Link
                        href="/categories"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                      >
                        <Sparkles className="w-4 h-4 text-[#ffe500] fill-[#ffe500]" />
                        <span>Flipkart Plus Zone</span>
                      </Link>
                      <Link
                        href="/checkout"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                      >
                        <Package className="w-4 h-4 text-[#2874f0]" />
                        <span>Orders</span>
                      </Link>
                      <Link
                        href="/categories"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                      >
                        <Heart className="w-4 h-4 text-[#2874f0]" />
                        <span>Wishlist</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Admin Panel Direct Link (Same Port) */}
            <Link
              href="/admin"
              className="text-xs font-bold text-white hover:text-amber-200 transition-colors whitespace-nowrap flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md border border-white/20"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Admin Panel</span>
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
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700 border-b border-slate-100"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Admin Control Center</span>
                  </Link>
                  <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700">
                    <Bell className="w-4 h-4 text-[#2874f0]" />
                    <span>Notification Preferences</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700">
                    <HelpCircle className="w-4 h-4 text-[#2874f0]" />
                    <span>24x7 Customer Care</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>AYUSH Quality Certificates</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700">
                    <Download className="w-4 h-4 text-[#2874f0]" />
                    <span>Download App</span>
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

      {/* Prescription Upload Modal */}
      <UploadPrescriptionModal
        isOpen={isRxModalOpen}
        onClose={() => setIsRxModalOpen(false)}
      />
    </header>
  );
}
