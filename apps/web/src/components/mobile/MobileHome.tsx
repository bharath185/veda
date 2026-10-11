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
} from 'lucide-react';
import { MobileBottomNav } from './MobileBottomNav';
import { useCartStore } from '../../store/useCartStore';

const mobileCategories = [
  { name: 'Rasayana', icon: '🍯', slug: 'classical-rasayanas' },
  { name: 'Shilajit', icon: '⚡', slug: 'herbal-supplements' },
  { name: 'Ashwagandha', icon: '🌿', slug: 'herbal-supplements' },
  { name: 'Pain Oils', icon: '🧴', slug: 'ayurvedic-thailams' },
  { name: 'Kumkumadi', icon: '✨', slug: 'botanical-skincare' },
  { name: 'Triphala', icon: '🥣', slug: 'churnas-kwath' },
  { name: 'Gut Care', icon: '🩺', slug: 'digestive-gut-health' },
  { name: 'Kadhas', icon: '🍵', slug: 'immunity-kadhas' },
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
  const { addItem } = useCartStore();

  return (
    <div className="min-h-screen bg-[#f1f2f4] pb-20 flex flex-col text-slate-800 font-sans">
      {/* Flipkart Mobile Sticky Top Header */}
      <header className="sticky top-0 z-40 bg-[#2874f0] text-white p-3 space-y-2.5 shadow-sm">
        {/* Brand & Notifications Row */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1">
            <span className="font-black italic text-lg tracking-tight">
              Veda<span className="text-[#ffe500]">Flow</span>
            </span>
            <span className="text-[9px] bg-[#ffe500] text-[#2874f0] font-black px-1 rounded-xs uppercase">
              AYUSH
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-xs font-bold bg-white text-[#2874f0] px-3 py-1 rounded-xs shadow-xs">
              Login
            </Link>
            <Bell className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Flipkart Search Bar with Mic & Camera */}
        <div className="relative flex items-center bg-white rounded-xs px-3 py-2 text-slate-800 shadow-inner">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search Ayurvedic medicines & brands"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-medium focus:outline-none bg-transparent placeholder:text-slate-500"
          />
          <Mic className="w-4 h-4 text-[#2874f0] ml-2 shrink-0 cursor-pointer" />
          <Camera className="w-4 h-4 text-[#2874f0] ml-2 shrink-0 cursor-pointer" />
        </div>

        {/* Delivery Pin Strip */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-100">
          <MapPin className="w-3.5 h-3.5 text-[#ffe500]" />
          <span>Deliver to Priya - Bengaluru 560001</span>
          <ChevronRight className="w-3 h-3 ml-auto text-blue-200" />
        </div>
      </header>

      {/* Circle Categories Horizontal Scroller */}
      <div className="bg-white py-3 px-2 border-b border-slate-200 overflow-x-auto flex gap-4 scrollbar-none">
        {mobileCategories.map((c) => (
          <Link
            key={c.name}
            href="/"
            className="flex flex-col items-center shrink-0 w-16 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-xl shadow-xs">
              {c.icon}
            </div>
            <span className="text-[10px] font-bold text-slate-800 mt-1 whitespace-nowrap">
              {c.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Flipkart SuperCoin Banner */}
      <div className="mx-2 mt-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 rounded-xs p-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xl">🪙</span>
          <div>
            <div className="text-xs font-black">140 Veda SuperCoins Available</div>
            <div className="text-[10px] font-semibold">Redeem coins for extra discounts on Rasayanas</div>
          </div>
        </div>
        <button className="bg-white text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-xs uppercase shadow-xs">
          View
        </button>
      </div>

      {/* Deal of the Day Banner Carousel */}
      <div className="mx-2 mt-2 bg-[#2874f0] text-white p-4 rounded-xs shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="bg-[#ffe500] text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded-2xs uppercase">
            Limited Time
          </span>
          <div className="flex items-center gap-1 text-[11px] font-bold font-mono">
            <Clock className="w-3 h-3 text-[#ffe500]" />
            <span>19h : 42m Left</span>
          </div>
        </div>
        <h3 className="text-base font-black leading-tight">
          Grand Ayurvedic Wellness Sale — Up to 50% Off
        </h3>
        <p className="text-[11px] text-blue-100">
          Charaka Samhita verified classical non-pharma herbal medicines.
        </p>
      </div>

      {/* Flipkart Product Grid */}
      <div className="p-2 space-y-2">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Today's Ayurvedic Deals
          </h4>
          <span className="text-xs font-bold text-[#2874f0]">View All</span>
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
                  <span className="ml-auto text-[8px] bg-[#2874f0] text-white font-black italic px-0.5 rounded-2xs">
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
                  className="w-full bg-[#ff9f00] hover:bg-[#f39700] text-white text-[10px] font-black py-1.5 rounded-2xs uppercase tracking-wider mt-1"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flipkart Trust Banner */}
      <div className="mx-2 my-2 bg-white p-3 rounded-xs border border-slate-200 flex items-center justify-around text-center text-[10px] font-bold text-slate-600">
        <div>🌿 100% Non-Pharma</div>
        <div>·</div>
        <div>🏆 AYUSH Certified</div>
        <div>·</div>
        <div>⚡ Express Delivery</div>
      </div>

      {/* Bottom Nav */}
      <MobileBottomNav />
    </div>
  );
}
