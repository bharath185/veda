'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Sparkles, Download, Star, Plus, ShieldCheck } from 'lucide-react';
import { MobileBottomNav } from './MobileBottomNav';
import { useCartStore } from '../../store/useCartStore';

const mobileCategories = [
  { name: 'Phones', icon: '📱', slug: 'smartphones-accessories' },
  { name: 'Laptops', icon: '💻', slug: 'laptops-computing' },
  { name: 'Audio', icon: '🎧', slug: 'audio-headphones' },
  { name: 'Watches', icon: '⌚', slug: 'smart-wearables' },
  { name: 'Men', icon: '👕', slug: 'men-fashion' },
  { name: 'Women', icon: '👗', slug: 'women-fashion' },
  { name: 'Home', icon: '🏠', slug: 'home-smart-living' },
  { name: 'Fitness', icon: '🏋️', slug: 'fitness-sports' },
];

const mobileProducts = [
  {
    id: 'm-1',
    title: 'Aura Pro 5G Flagship',
    slug: 'aura-pro-5g-smartphone',
    price: 69999,
    compareAtPrice: 79999,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'm-2',
    title: 'SonicWave ANC Hi-Fi',
    slug: 'sonicwave-anc-over-ear-headphones',
    price: 24999,
    compareAtPrice: 29999,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'm-3',
    title: 'Chronos Titanium 46mm',
    slug: 'chronos-horizon-titanium-smartwatch',
    price: 34999,
    compareAtPrice: 39999,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'm-4',
    title: 'RoboClean Lidar Mop',
    slug: 'roboclean-lidar-omni-vacuum-mop',
    price: 48999,
    compareAtPrice: 58999,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&auto=format&fit=crop&q=80',
  },
];

export function MobileHome() {
  const [showPwaBanner, setShowPwaBanner] = useState(true);
  const { addItem } = useCartStore();

  return (
    <div className="min-h-screen bg-slate-50 pb-24 flex flex-col">
      {/* Mobile Sticky Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-black text-xl text-slate-900 tracking-tight">ShopFlow</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-slate-100 text-slate-600">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search phones, clothes, headphones..."
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </header>

      {/* PWA Install Banner */}
      {showPwaBanner && (
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2.5 flex items-center justify-between text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 animate-bounce" />
            <span>Install ShopFlow for faster 1-tap checkout & offline access</span>
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
      <div className="overflow-x-auto no-scrollbar py-3 px-4 flex gap-3 bg-white border-b border-slate-100">
        {mobileCategories.map((c) => (
          <Link
            key={c.name}
            href={`/categories/${c.slug}`}
            className="flex flex-col items-center gap-1 min-w-[62px] active:scale-95 transition-transform"
          >
            <div className="w-13 h-13 rounded-2xl bg-indigo-50 flex items-center justify-center text-xl shadow-xs border border-indigo-100/50">
              {c.icon}
            </div>
            <span className="text-[11px] font-semibold text-slate-700 tracking-tight">{c.name}</span>
          </Link>
        ))}
      </div>

      {/* Featured Swipeable Carousel Banner */}
      <div className="p-4">
        <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg">
          <div className="space-y-2 z-10 relative">
            <span className="inline-flex items-center gap-1 bg-indigo-500/30 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              <Sparkles className="w-3 h-3" /> Festival Drop
            </span>
            <h2 className="text-xl font-black">Aura Pro 5G Flagship</h2>
            <p className="text-xs text-slate-300">Save ₹10,000 + Free next-day courier delivery</p>
            <Link
              href="/products/aura-pro-5g-smartphone"
              className="inline-block mt-2 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl active:bg-indigo-700"
            >
              Shop Now
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=80"
            alt="Hero"
            className="absolute -right-4 -bottom-4 w-36 h-36 object-cover rounded-2xl opacity-60"
          />
        </div>
      </div>

      {/* 2-Column Mobile Product Grid */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900">Trending Right Now</h3>
          <span className="text-xs font-bold text-indigo-600">See all</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {mobileProducts.map((p) => {
            const discount = p.compareAtPrice
              ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
              : 0;

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div className="relative aspect-square bg-slate-100">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
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
                      <div className="text-xs font-extrabold text-slate-900">₹{p.price.toLocaleString('en-IN')}</div>
                    </div>
                    <button
                      onClick={() =>
                        addItem({
                          id: `cart-${p.id}`,
                          variantId: `var-${p.id}`,
                          productId: p.id,
                          title: p.title,
                          sku: `SF-${p.slug.toUpperCase().slice(0, 8)}`,
                          price: p.price,
                          quantity: 1,
                          image: p.image,
                        })
                      }
                      className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center active:scale-90 transition-transform shadow-sm"
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

      {/* Bottom Sticky Tab Navigation */}
      <MobileBottomNav />
    </div>
  );
}
