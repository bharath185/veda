'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  ShieldCheck,
  Award,
  Zap,
  HelpCircle,
  Briefcase,
  Gift,
  CreditCard,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { DesktopHeader } from './DesktopHeader';
import { useCartStore } from '../../store/useCartStore';

const mockAyurvedaCatalog = [
  {
    id: 'vd-prod-1',
    title: 'Swarna Bhasma Amrit Chyawanprash (Wild Forest Amla & A2 Ghee 1kg)',
    slug: 'swarna-bhasma-chyawanprash-1kg',
    category: 'Classical Rasayanas',
    price: 1499,
    compareAtPrice: 1799,
    discountPct: 17,
    rating: 4.8,
    reviews: 1420,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
    tags: ['Gold Bhasma', 'Immunity Booster', 'Ojas'],
    assured: true,
  },
  {
    id: 'vd-prod-2',
    title: 'Pure Himalayan Shilajit Resin (Gold Grade · 75% Fulvic Acid 20g)',
    slug: 'pure-himalayan-shilajit-resin-20g',
    category: 'Herbal Supplements',
    price: 1299,
    compareAtPrice: 1699,
    discountPct: 23,
    rating: 4.9,
    reviews: 2180,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    tags: ['NABL Lab Tested', 'Stamina', '84+ Minerals'],
    assured: true,
  },
  {
    id: 'vd-prod-3',
    title: 'KSM-66 Organic Ashwagandha Root Extract 600mg (60 Veg Capsules)',
    slug: 'ksm66-organic-ashwagandha-capsules',
    category: 'Herbal Supplements',
    price: 799,
    compareAtPrice: 999,
    discountPct: 20,
    rating: 4.7,
    reviews: 954,
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=800&auto=format&fit=crop&q=80',
    tags: ['Cortisol Reduction', 'Deep Sleep', 'Calm'],
    assured: true,
  },
  {
    id: 'vd-prod-4',
    title: 'Kashmiri Saffron 26-Herb Kumkumadi Miraculous Night Glow Oil (30ml)',
    slug: 'kashmiri-saffron-kumkumadi-night-oil',
    category: 'Botanical Skincare',
    price: 1299,
    compareAtPrice: 1699,
    discountPct: 23,
    rating: 4.8,
    reviews: 840,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
    tags: ['Kashmiri Saffron', 'Pigmentation', 'Radiance'],
    assured: true,
  },
  {
    id: 'vd-prod-5',
    title: 'Mahanarayan Taila Classical 21-Day Medicated Joint Pain Oil (200ml)',
    slug: 'mahanarayan-taila-joint-pain-oil',
    category: 'Medicated Thailams',
    price: 499,
    compareAtPrice: 650,
    discountPct: 23,
    rating: 4.6,
    reviews: 612,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
    tags: ['Vata Dosha', 'Joint Mobility', 'Traditional'],
    assured: true,
  },
  {
    id: 'vd-prod-6',
    title: 'Stone-Ground Organic Triphala Churna Digestive Colon Detox (250g)',
    slug: 'organic-triphala-churna-digestive-detox',
    category: 'Organic Churnas',
    price: 299,
    compareAtPrice: 399,
    discountPct: 25,
    rating: 4.7,
    reviews: 1105,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    tags: ['Gut Cleanse', 'Constipation Relief', 'Tridoshic'],
    assured: true,
  },
];

const flipkartBanners = [
  {
    id: 1,
    title: 'GRAND AYURVEDIC WELLNESS FESTIVAL',
    subtitle: 'Up to 50% Off Classical Rasayanas, Chyawanprash & Shilajit | Plus Members Extra 10% Off',
    bgGradient: 'from-[#0057b7] via-[#2874f0] to-[#0a84ff]',
    badge: 'AYUSH Certified Non-Pharma Platform',
    btnText: 'Shop Classical Medicines',
  },
  {
    id: 2,
    title: 'PURE HIMALAYAN RESINS & GOLD SHILAJIT',
    subtitle: 'NABL Certified Zero Heavy Metals · High Fulvic Acid · Direct from 16,000+ ft Altitude',
    bgGradient: 'from-[#144272] via-[#0A2647] to-[#205295]',
    badge: '100% Authentic Botanical Medicine',
    btnText: 'Explore Lab Reports',
  },
  {
    id: 3,
    title: 'WINTER IMMUNITY & AYURVEDIC TONICS',
    subtitle: 'Swarna Bhasma Formulations & Tulsi Kadhas | Same-Day Eco Dispatch',
    bgGradient: 'from-[#0b6623] via-[#1b4332] to-[#2d6a4f]',
    badge: 'Classical Authentic AYUSH Formulations',
    btnText: 'Order Immunity Pack',
  },
];

export function DesktopHome() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [wishlisted, setWishlisted] = useState<Record<string, boolean>>({});
  const { addItem, isOpen, setIsOpen, items, removeItem, updateQuantity, getSubtotal, getGrandTotal } = useCartStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % flipkartBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlisted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = async (product: typeof mockAyurvedaCatalog[0]) => {
    try {
      const res = await fetch('http://localhost:4000/share/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, platform: 'instagram' }),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        await navigator.clipboard.writeText(data.readyCaption);
      } else {
        await navigator.clipboard.writeText(
          `🌿 PURE AYURVEDA WELLNESS: ${product.title} for ₹${product.price.toLocaleString('en-IN')}! 🌿 100% Non-Pharma Herbal Medicine. Shop online: http://localhost:3005/products/${product.slug} #ayurveda #pureherbs`,
        );
      }
      setCopiedId(product.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      setCopiedId(product.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f2f4] text-slate-800 font-sans flex flex-col justify-between">
      {/* 1. Flipkart Header */}
      <DesktopHeader />

      <main className="max-w-7xl mx-auto w-full px-2 sm:px-4 py-3 space-y-3">
        {/* 2. Flipkart Hero Carousel Banner */}
        <div className="relative w-full h-72 rounded-sm overflow-hidden shadow-sm group">
          {flipkartBanners.map((b, idx) => (
            <div
              key={b.id}
              className={`absolute inset-0 bg-gradient-to-r ${b.bgGradient} text-white flex flex-col justify-center px-12 transition-opacity duration-700 ${
                idx === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div className="max-w-2xl space-y-3">
                <span className="inline-block bg-[#ffe500] text-slate-900 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-sm shadow-sm tracking-wide">
                  {b.badge}
                </span>
                <h2 className="text-3xl font-black tracking-tight leading-tight drop-shadow-sm">
                  {b.title}
                </h2>
                <p className="text-sm font-medium text-slate-100 drop-shadow-sm">
                  {b.subtitle}
                </p>
                <div className="pt-2">
                  <button className="bg-white hover:bg-slate-100 text-[#2874f0] font-black px-6 py-2.5 text-xs rounded-sm shadow-md transition-transform active:scale-95 uppercase tracking-wider">
                    {b.btnText}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel Arrows */}
          <button
            onClick={() => setCurrentBanner((prev) => (prev - 1 + flipkartBanners.length) % flipkartBanners.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-20 bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center rounded-r-sm shadow-md z-20 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6 stroke-[3]" />
          </button>
          <button
            onClick={() => setCurrentBanner((prev) => (prev + 1) % flipkartBanners.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-20 bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center rounded-l-sm shadow-md z-20 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6 stroke-[3]" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {flipkartBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentBanner ? 'w-6 bg-white' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 3. Flipkart Deals of the Day Rail */}
        <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Row */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Deals of the Day</h3>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-sm">
                <Clock className="w-3.5 h-3.5 text-[#2874f0]" />
                <span className="font-mono text-slate-700 font-bold">19h : 42m : 18s Left</span>
              </div>
            </div>
            <Link
              href="/"
              className="bg-[#2874f0] hover:bg-[#1a5bc4] text-white text-xs font-bold px-4 py-2 rounded-sm shadow-sm uppercase tracking-wider transition-colors"
            >
              View All
            </Link>
          </div>

          {/* Horizontal Product Grid */}
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {mockAyurvedaCatalog.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white border border-slate-100 hover:border-slate-300 rounded-sm p-3 flex flex-col justify-between hover:shadow-md transition-all"
              >
                {/* Wishlist Heart Icon */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2 right-2 z-10 p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      wishlisted[product.id] ? 'fill-red-500 text-red-500' : 'fill-none'
                    }`}
                  />
                </button>

                {/* Product Image Link */}
                <Link
                  href={`/products/${product.slug}`}
                  className="w-full h-44 flex items-center justify-center overflow-hidden mb-2 relative"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Details */}
                <div className="space-y-1.5">
                  {/* Title */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="block text-xs font-bold text-slate-800 hover:text-[#2874f0] line-clamp-2 leading-tight h-8"
                    title={product.title}
                  >
                    {product.title}
                  </Link>

                  {/* Rating Badge + Veda Assured */}
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-xs flex items-center gap-0.5">
                      <span>{product.rating}</span>
                      <Star className="w-2.5 h-2.5 fill-white" />
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ({product.reviews.toLocaleString('en-IN')})
                    </span>

                    {/* Iconic Veda-Assured / f-Assured Badge */}
                    <span className="ml-auto flex items-center bg-[#2874f0] text-white text-[9px] font-black italic px-1 rounded-2xs tracking-tighter" title="100% Genuine Lab-Tested Herbal Guarantee">
                      Veda<span className="text-[#ffe500]">✓</span>
                    </span>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-baseline gap-1.5 pt-0.5">
                    <span className="text-sm font-black text-slate-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-slate-400 line-through">
                      ₹{product.compareAtPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] font-bold text-[#388e3c]">
                      {product.discountPct}% off
                    </span>
                  </div>

                  {/* Daily Free Delivery Tag */}
                  <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    <Truck className="w-3 h-3 text-[#2874f0]" />
                    <span>Free Delivery</span>
                  </div>
                </div>

                {/* Action Row */}
                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center gap-1">
                  <button
                    onClick={() =>
                      addItem({
                        id: product.id,
                        productId: product.id,
                        variantId: product.id,
                        sku: product.id,
                        title: product.title,
                        price: product.price,
                        image: product.image,
                        quantity: 1,
                      })
                    }
                    className="flex-1 bg-[#ff9f00] hover:bg-[#f39700] text-white text-[11px] font-black py-1.5 rounded-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    <span>Add</span>
                  </button>

                  <button
                    onClick={() => handleShare(product)}
                    className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xs transition-colors"
                    title="Generate Instagram Share Link"
                  >
                    {copiedId === product.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Flipkart 4-in-1 Category Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Box 1 */}
          <div className="bg-white p-4 rounded-sm shadow-sm border border-slate-200 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h4 className="font-bold text-sm text-slate-900">Classical Rasayanas</h4>
              <Link href="/categories/classical-rasayanas" className="text-xs font-bold text-[#2874f0] hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 border border-slate-100 hover:shadow-xs transition-shadow">
                <span className="text-2xl">🍯</span>
                <div className="font-bold text-slate-800 mt-1">Swarna Chyawanprash</div>
                <div className="text-[10px] text-[#388e3c] font-bold">Min 17% Off</div>
              </div>
              <div className="p-2 border border-slate-100 hover:shadow-xs transition-shadow">
                <span className="text-2xl">🌿</span>
                <div className="font-bold text-slate-800 mt-1">Brahma Rasayana</div>
                <div className="text-[10px] text-[#388e3c] font-bold">Special Price</div>
              </div>
              <div className="p-2 border border-slate-100 hover:shadow-xs transition-shadow">
                <span className="text-2xl">⚡</span>
                <div className="font-bold text-slate-800 mt-1">Agastya Haritaki</div>
                <div className="text-[10px] text-[#388e3c] font-bold">From ₹349</div>
              </div>
              <div className="p-2 border border-slate-100 hover:shadow-xs transition-shadow">
                <span className="text-2xl">🍵</span>
                <div className="font-bold text-slate-800 mt-1">Draksharishta</div>
                <div className="text-[10px] text-[#388e3c] font-bold">Up to 25% Off</div>
              </div>
            </div>
          </div>

          {/* Box 2 */}
          <div className="bg-white p-4 rounded-sm shadow-sm border border-slate-200 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h4 className="font-bold text-sm text-slate-900">Pure Shilajit & Minerals</h4>
              <Link href="/categories/herbal-supplements" className="text-xs font-bold text-[#2874f0] hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 border border-slate-100 hover:shadow-xs transition-shadow">
                <span className="text-2xl">🏔️</span>
                <div className="font-bold text-slate-800 mt-1">Gold Grade Resin</div>
                <div className="text-[10px] text-[#388e3c] font-bold">23% Off</div>
              </div>
              <div className="p-2 border border-slate-100 hover:shadow-xs transition-shadow">
                <span className="text-2xl">✨</span>
                <div className="font-bold text-slate-800 mt-1">Shilajit Liquid Drops</div>
                <div className="text-[10px] text-[#388e3c] font-bold">From ₹899</div>
              </div>
              <div className="p-2 border border-slate-100 hover:shadow-xs transition-shadow">
                <span className="text-2xl">🧬</span>
                <div className="font-bold text-slate-800 mt-1">Gokshura Rasayana</div>
                <div className="text-[10px] text-[#388e3c] font-bold">Min 20% Off</div>
              </div>
              <div className="p-2 border border-slate-100 hover:shadow-xs transition-shadow">
                <span className="text-2xl">🔬</span>
                <div className="font-bold text-slate-800 mt-1">Lab Tested 75% Fulvic</div>
                <div className="text-[10px] text-[#388e3c] font-bold">Top Pick</div>
              </div>
            </div>
          </div>

          {/* Box 3 */}
          <div className="bg-white p-4 rounded-sm shadow-sm border border-slate-200 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h4 className="font-bold text-sm text-slate-900">Classical Pain Oils</h4>
              <Link href="/categories/ayurvedic-thailams" className="text-xs font-bold text-[#2874f0] hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 border border-slate-100 hover:shadow-xs transition-shadow">
                <span className="text-2xl">🧴</span>
                <div className="font-bold text-slate-800 mt-1">Mahanarayan Taila</div>
                <div className="text-[10px] text-[#388e3c] font-bold">₹499 Only</div>
              </div>
              <div className="p-2 border border-slate-100 hover:shadow-xs transition-shadow">
                <span className="text-2xl">🌿</span>
                <div className="font-bold text-slate-800 mt-1">Ksheerabala 101</div>
                <div className="text-[10px] text-[#388e3c] font-bold">Under ₹650</div>
              </div>
              <div className="p-2 border border-slate-100 hover:shadow-xs transition-shadow">
                <span className="text-2xl">💆‍♂️</span>
                <div className="font-bold text-slate-800 mt-1">Murivenna Fast Oil</div>
                <div className="text-[10px] text-[#388e3c] font-bold">Min 15% Off</div>
              </div>
              <div className="p-2 border border-slate-100 hover:shadow-xs transition-shadow">
                <span className="text-2xl">🌱</span>
                <div className="font-bold text-slate-800 mt-1">Dhanwantharam 200ml</div>
                <div className="text-[10px] text-[#388e3c] font-bold">Special Price</div>
              </div>
            </div>
          </div>

          {/* Box 4 */}
          <div className="bg-white p-4 rounded-sm shadow-sm border border-slate-200 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h4 className="font-bold text-sm text-slate-900">Ayurvedic Skincare & Hair</h4>
              <Link href="/categories/botanical-skincare" className="text-xs font-bold text-[#2874f0] hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 border border-slate-100 hover:shadow-xs transition-shadow">
                <span className="text-2xl">✨</span>
                <div className="font-bold text-slate-800 mt-1">Kumkumadi 30ml</div>
                <div className="text-[10px] text-[#388e3c] font-bold">23% Off</div>
              </div>
              <div className="p-2 border border-slate-100 hover:shadow-xs transition-shadow">
                <span className="text-2xl">💇‍♀️</span>
                <div className="font-bold text-slate-800 mt-1">Neelibhringadi Hair</div>
                <div className="text-[10px] text-[#388e3c] font-bold">From ₹399</div>
              </div>
              <div className="p-2 border border-slate-100 hover:shadow-xs transition-shadow">
                <span className="text-2xl">🌸</span>
                <div className="font-bold text-slate-800 mt-1">Nalpamaradi Skin Oil</div>
                <div className="text-[10px] text-[#388e3c] font-bold">Min 20% Off</div>
              </div>
              <div className="p-2 border border-slate-100 hover:shadow-xs transition-shadow">
                <span className="text-2xl">🥣</span>
                <div className="font-bold text-slate-800 mt-1">Ubtan Herbal Scrub</div>
                <div className="text-[10px] text-[#388e3c] font-bold">Special Price</div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Flipkart Assured Ayurvedic Trust Bar */}
        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h5 className="font-bold text-xs text-slate-900">100% Non-Pharma Guarantee</h5>
            <p className="text-[11px] text-slate-500">Only pure classical botanical formulations & zero chemical drugs</p>
          </div>

          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h5 className="font-bold text-xs text-slate-900">AYUSH GMP Certified</h5>
            <p className="text-[11px] text-slate-500">NABL lab tested for zero heavy metals & microbial safety</p>
          </div>

          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h5 className="font-bold text-xs text-slate-900">Eco-Friendly Dispatch</h5>
            <p className="text-[11px] text-slate-500">Live GPS tracking on EV couriers across 19,000+ pincodes</p>
          </div>

          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h5 className="font-bold text-xs text-slate-900">7-Day Easy Returns</h5>
            <p className="text-[11px] text-slate-500">Hassle-free replacement for damaged or unsealed packaging</p>
          </div>
        </div>
      </main>

      {/* 6. Flipkart Comprehensive Multi-Column Footer */}
      <footer className="bg-[#172337] text-white text-xs mt-8">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-5 gap-8 border-b border-slate-700/80">
          {/* Col 1: ABOUT */}
          <div className="space-y-2">
            <h6 className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">ABOUT VEDAFLOW</h6>
            <ul className="space-y-1.5 text-slate-300">
              <li><Link href="/" className="hover:underline">Contact Us</Link></li>
              <li><Link href="/" className="hover:underline">About Our Vaidyas</Link></li>
              <li><Link href="/" className="hover:underline">Careers in Ayurveda</Link></li>
              <li><Link href="/" className="hover:underline">VedaFlow Stories</Link></li>
              <li><Link href="/" className="hover:underline">Press & AYUSH Media</Link></li>
              <li><Link href="/" className="hover:underline">Corporate Information</Link></li>
            </ul>
          </div>

          {/* Col 2: AYUSH HELP */}
          <div className="space-y-2">
            <h6 className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">AYUSH HELP</h6>
            <ul className="space-y-1.5 text-slate-300">
              <li><Link href="/" className="hover:underline">Payments & UPI</Link></li>
              <li><Link href="/" className="hover:underline">Shipping & Ekart</Link></li>
              <li><Link href="/" className="hover:underline">Cancellation & Returns</Link></li>
              <li><Link href="/" className="hover:underline">NABL Lab Reports</Link></li>
              <li><Link href="/" className="hover:underline">FAQ & Dosha Quiz</Link></li>
              <li><Link href="/" className="hover:underline">Report Formulation Infringement</Link></li>
            </ul>
          </div>

          {/* Col 3: POLICY */}
          <div className="space-y-2">
            <h6 className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">CONSUMER POLICY</h6>
            <ul className="space-y-1.5 text-slate-300">
              <li><Link href="/" className="hover:underline">Return Policy</Link></li>
              <li><Link href="/" className="hover:underline">Terms Of Use</Link></li>
              <li><Link href="/" className="hover:underline">Security (PCI-DSS)</Link></li>
              <li><Link href="/" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/" className="hover:underline">Sitemap</Link></li>
              <li><Link href="/" className="hover:underline">Grievance Redressal</Link></li>
            </ul>
          </div>

          {/* Col 4: SOCIAL */}
          <div className="space-y-2">
            <h6 className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">SOCIAL & COMMUNITY</h6>
            <ul className="space-y-1.5 text-slate-300">
              <li><Link href="/" className="hover:underline">Instagram (@vedaflow.ayur)</Link></li>
              <li><Link href="/" className="hover:underline">YouTube (Herbal Wellness Channel)</Link></li>
              <li><Link href="/" className="hover:underline">Twitter / X Wellness</Link></li>
              <li><Link href="/" className="hover:underline">WhatsApp Community Updates</Link></li>
            </ul>
          </div>

          {/* Col 5: Mail Us / Address */}
          <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-700/80 md:pl-6 text-slate-300">
            <h6 className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">REGISTERED AYURVEDIC OFFICE</h6>
            <p className="leading-relaxed text-[11px]">
              VedaFlow E-Commerce Private Limited,<br />
              Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103, Karnataka, India<br />
              CIN: U51109KA2026PTC066107<br />
              Telephone: <span className="text-[#2874f0] font-bold">044-45614700 / 044-67415800</span>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div className="flex flex-wrap items-center gap-6 font-semibold">
            <Link href="http://localhost:3001" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Briefcase className="w-3.5 h-3.5 text-[#ffe500]" />
              <span>Become a Seller</span>
            </Link>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#ffe500]" />
              <span>Advertise</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-[#ffe500]" />
              <span>Gift Cards</span>
            </span>
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#ffe500]" />
              <span>Help Center</span>
            </span>
          </div>

          <div className="text-slate-400">
            © 2026 VedaFlow.com · 100% Classical Ayurveda Non-Pharma
          </div>

          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px]">
            <CreditCard className="w-4 h-4 text-slate-400" />
            <span>Visa · MasterCard · RuPay · NetBanking · UPI · COD</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
