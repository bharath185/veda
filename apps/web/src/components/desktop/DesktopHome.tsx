'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, Share2, Check, ArrowRight, ShieldCheck, Leaf, Sparkles, RefreshCw, Award, HeartPulse } from 'lucide-react';
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
    rating: 4.95,
    reviews: 218,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
    tags: ['Gold Bhasma', 'Immunity', 'Ojas Vitality'],
  },
  {
    id: 'vd-prod-2',
    title: 'Pure Himalayan Shilajit Resin (Gold Grade · 75% Fulvic Acid 20g)',
    slug: 'pure-himalayan-shilajit-resin-20g',
    category: 'Herbal Supplements',
    price: 1299,
    compareAtPrice: 1699,
    rating: 4.98,
    reviews: 342,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    tags: ['Lab Tested', 'Stamina', '84+ Minerals'],
  },
  {
    id: 'vd-prod-3',
    title: 'KSM-66 Organic Ashwagandha Root Extract 600mg (60 Veg Capsules)',
    slug: 'ksm66-organic-ashwagandha-capsules',
    category: 'Herbal Supplements',
    price: 799,
    compareAtPrice: 999,
    rating: 4.9,
    reviews: 184,
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=800&auto=format&fit=crop&q=80',
    tags: ['Stress & Cortisol', 'Deep Sleep', 'Calm'],
  },
  {
    id: 'vd-prod-4',
    title: 'Kashmiri Saffron 26-Herb Kumkumadi Miraculous Night Glow Oil (30ml)',
    slug: 'kashmiri-saffron-kumkumadi-night-oil',
    category: 'Botanical Skincare',
    price: 1299,
    compareAtPrice: 1699,
    rating: 4.92,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
    tags: ['Pure Saffron', 'Pigmentation', 'Skin Radiance'],
  },
  {
    id: 'vd-prod-5',
    title: 'Mahanarayan Taila Classical 21-Day Medicated Joint Pain Oil (200ml)',
    slug: 'mahanarayan-taila-joint-pain-oil',
    category: 'Medicated Thailams',
    price: 499,
    compareAtPrice: 650,
    rating: 4.88,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
    tags: ['Vata Relief', 'Joint Mobility', 'Traditional'],
  },
  {
    id: 'vd-prod-6',
    title: 'Stone-Ground Organic Triphala Churna Digestive Colon Detox (250g)',
    slug: 'organic-triphala-churna-digestive-detox',
    category: 'Organic Churnas',
    price: 299,
    compareAtPrice: 399,
    rating: 4.85,
    reviews: 290,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    tags: ['Gut Health', 'Constipation Relief', 'Tridosha'],
  },
];

export function DesktopHome() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const { addItem, isOpen, setIsOpen, items, removeItem, updateQuantity, getSubtotal, getGrandTotal } = useCartStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'All',
    'Classical Rasayanas',
    'Herbal Supplements',
    'Botanical Skincare',
    'Medicated Thailams',
    'Organic Churnas',
  ];

  const filteredProducts = selectedCategory === 'All'
    ? mockAyurvedaCatalog
    : mockAyurvedaCatalog.filter((p) => p.category === selectedCategory);

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
      // fallback
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col text-slate-800">
      <DesktopHeader />

      {/* Hero Showcase with Botanical Aesthetics */}
      <section className="bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-900 text-white py-16 px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 items-center">
          <div className="col-span-7 space-y-6 z-10">
            <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5 text-amber-300" /> Authentic AYUSH Certified Herbal Medicine
            </span>
            <h1 className="text-5xl font-black tracking-tight leading-tight">
              Ancient Ayurvedic Wisdom. <br />
              <span className="text-emerald-400">Pure, Non-Pharma Botanical Health.</span>
            </h1>
            <p className="text-stone-300 text-base max-w-xl font-normal leading-relaxed">
              Classical formulations brewed with wild-harvested herbs, zero synthetic fillers, and batch-tested for purity. Balance your Vata, Pitta, and Kapha naturally.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link
                href="/products/swarna-bhasma-chyawanprash-1kg"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
              >
                <span>Shop Swarna Chyawanprash</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#catalog"
                className="bg-white/10 hover:bg-white/20 text-stone-200 font-semibold px-6 py-3.5 rounded-2xl border border-white/10 transition-colors"
              >
                Explore 50+ Classical Remedies
              </a>
            </div>
          </div>

          <div className="col-span-5 relative flex justify-center">
            <div className="w-88 h-88 rounded-3xl bg-emerald-500/10 border border-emerald-400/20 backdrop-blur-xl p-6 shadow-2xl relative">
              <img
                src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=700&auto=format&fit=crop&q=80"
                alt="Ayurvedic Rasayana"
                className="w-full h-full object-cover rounded-2xl shadow-inner"
              />
              <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 px-4 py-3 rounded-2xl shadow-xl border border-emerald-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Lab Verified</div>
                  <div className="text-xs font-extrabold text-slate-900">Zero Heavy Metals Tested</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ayurvedic Botanical Trust Indicators */}
      <section className="bg-white border-b border-emerald-100 py-6 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-6 text-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">100% Non-Pharma Herbal</div>
              <div className="text-xs text-slate-500">Pure botanicals & wild forest extracts</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">AYUSH Premium Certified</div>
              <div className="text-xs text-slate-500">Charaka & Sushruta Samhita compliant</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Heavy Metals Screened</div>
              <div className="text-xs text-slate-500">Lead, mercury, arsenic lab-certified safe</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Vaidya Formulated</div>
              <div className="text-xs text-slate-500">Root-cause dosha balancing therapy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog with Botanical Filters */}
      <main id="catalog" className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full grid grid-cols-12 gap-8">
        {/* Filters Sidebar */}
        <aside className="col-span-3 space-y-6">
          <div className="bg-white rounded-3xl border border-emerald-100 p-5 shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Remedy Categories</span>
            </h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-emerald-50'
                  }`}
                >
                  <span>{cat}</span>
                </button>
              ))}
            </div>

            {/* Dosha Filter */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-800">Filter By Dosha</h4>
              <div className="space-y-1.5 text-xs">
                {['Tridoshic (All Body Types)', 'Vata Balancing (Calm & Joints)', 'Pitta Cooling (Acidity & Glow)', 'Kapha Energizing (Detox & Agni)'].map((dosha) => (
                  <label key={dosha} className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" />
                    <span>{dosha}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Price Range</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="₹ Min"
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="₹ Max"
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="col-span-9 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                {selectedCategory === 'All' ? 'Curated Ayurvedic Formulations' : selectedCategory}
              </h2>
              <span className="text-xs text-emerald-700 font-semibold">100% Pure Non-Pharma Remedies ({filteredProducts.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-emerald-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="featured">Vaidya Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to High</option>
                <option value="rating">Highest Verified Rating</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const discount = product.compareAtPrice
                ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-emerald-100/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all group flex flex-col justify-between"
                >
                  <div className="relative aspect-square overflow-hidden bg-emerald-50/40">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-emerald-700 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow">
                        {discount}% OFF
                      </span>
                    )}

                    {/* Instagram Share Link Button */}
                    <button
                      onClick={() => handleShare(product)}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur hover:bg-white text-slate-700 hover:text-emerald-700 p-2 rounded-full shadow transition-colors"
                      title="Generate Instagram Story/Post Share Link with UTM & Captions"
                    >
                      {copiedId === product.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">
                        {product.category}
                      </div>
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mt-0.5"
                      >
                        {product.title}
                      </Link>
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
                        <div className="flex items-center text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                          <span className="font-bold ml-1 text-slate-800">{product.rating}</span>
                        </div>
                        <span>·</span>
                        <span>{product.reviews} reviews</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-base font-extrabold text-slate-900">
                          ₹{product.price.toLocaleString('en-IN')}
                        </div>
                        {product.compareAtPrice && (
                          <div className="text-[11px] text-slate-400 line-through">
                            ₹{product.compareAtPrice.toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          addItem({
                            id: `cart-${product.id}`,
                            variantId: `var-${product.id}`,
                            productId: product.id,
                            title: product.title,
                            sku: `VD-${product.slug.toUpperCase().slice(0, 8)}`,
                            price: product.price,
                            compareAtPrice: product.compareAtPrice,
                            quantity: 1,
                            image: product.image,
                          })
                        }
                        className="bg-emerald-800 hover:bg-emerald-700 text-white p-2.5 rounded-xl shadow transition-colors flex items-center gap-1.5 text-xs font-bold"
                        title="Add to cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Cart Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="p-5 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                <h3 className="font-black text-slate-900 text-base">Ayurvedic Cart ({items.length})</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Leaf className="w-12 h-12 mx-auto stroke-1 text-emerald-400" />
                  <p className="font-semibold text-sm">Your herbal wellness cart is empty.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 border-b border-slate-100 pb-4">
                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover bg-emerald-50" />
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</div>
                      <div className="text-xs font-bold text-emerald-700 mt-0.5">₹{item.price.toLocaleString('en-IN')}</div>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-[10px] text-red-500 hover:underline ml-auto font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t border-emerald-100 bg-slate-50 space-y-3">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Remedies Subtotal:</span>
                  <span className="font-bold">₹{getSubtotal().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Estimated GST (12% Ayurvedic standard):</span>
                  <span>₹{Math.round(getSubtotal() * 0.12).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount:</span>
                  <span className="text-emerald-700">₹{getGrandTotal().toLocaleString('en-IN')}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-700/30 flex items-center justify-center gap-2 text-sm transition-all"
                >
                  Proceed to Secure Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
