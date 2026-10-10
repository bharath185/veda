'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, Share2, Check, ArrowRight, Shield, Zap, RefreshCw } from 'lucide-react';
import { DesktopHeader } from './DesktopHeader';
import { useCartStore } from '../../store/useCartStore';

const mockCatalog = [
  {
    id: 'sf-prod-1',
    title: 'Aura Pro 5G Flagship Smartphone',
    slug: 'aura-pro-5g-smartphone',
    category: 'Smartphones & Accessories',
    price: 69999,
    compareAtPrice: 79999,
    rating: 4.9,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    tags: ['Flagship', '5G', 'OLED'],
  },
  {
    id: 'sf-prod-2',
    title: 'SonicWave ANC Over-Ear Hi-Fi Headphones',
    slug: 'sonicwave-anc-over-ear-headphones',
    category: 'Audio & Hi-Fi',
    price: 24999,
    compareAtPrice: 29999,
    rating: 4.8,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    tags: ['Noise-Cancelling', 'Lossless'],
  },
  {
    id: 'sf-prod-3',
    title: 'Chronos Horizon Titanium Smartwatch',
    slug: 'chronos-horizon-titanium-smartwatch',
    category: 'Smart Wearables',
    price: 34999,
    compareAtPrice: 39999,
    rating: 4.9,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    tags: ['Titanium', 'ECG', 'Sapphire'],
  },
  {
    id: 'sf-prod-4',
    title: 'Zenith Titan 16" Creator Workstation',
    slug: 'zenith-titan-16-creator-laptop',
    category: 'Laptops & Computing',
    price: 219999,
    compareAtPrice: 239999,
    rating: 5.0,
    reviews: 38,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    tags: ['64GB RAM', 'M3 Max'],
  },
  {
    id: 'sf-prod-5',
    title: 'RoboClean Lidar Omni Vacuum & Mop',
    slug: 'roboclean-lidar-omni-vacuum-mop',
    category: 'Home & Smart Living',
    price: 48999,
    compareAtPrice: 58999,
    rating: 4.7,
    reviews: 52,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
    tags: ['Auto-Empty', 'LiDAR'],
  },
  {
    id: 'sf-prod-6',
    title: 'PowerDial 24kg Quick-Adjust Dumbbell Pair',
    slug: 'powerdial-quick-adjust-dumbbell-pair',
    category: 'Fitness & Sports',
    price: 18999,
    compareAtPrice: 22999,
    rating: 4.8,
    reviews: 97,
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    tags: ['Home Gym', 'Strength'],
  },
];

export function DesktopHome() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const { addItem, isOpen, setIsOpen, items, removeItem, updateQuantity, getSubtotal, getGrandTotal } = useCartStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Smartphones & Accessories', 'Audio & Hi-Fi', 'Smart Wearables', 'Laptops & Computing', 'Home & Smart Living', 'Fitness & Sports'];

  const filteredProducts = selectedCategory === 'All'
    ? mockCatalog
    : mockCatalog.filter((p) => p.category === selectedCategory);

  const handleShare = async (product: typeof mockCatalog[0]) => {
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
          `✨ NEW DROP: ${product.title} for ₹${product.price.toLocaleString('en-IN')}! 🛍️ Check it out at http://localhost:3000/products/${product.slug} #shopflow`,
        );
      }
      setCopiedId(product.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DesktopHeader />

      {/* Hero Showcase */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-16 px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 items-center">
          <div className="col-span-7 space-y-6 z-10">
            <span className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              🚀 Flagship Tech Drops 2026
            </span>
            <h1 className="text-5xl font-black tracking-tight leading-tight">
              Curated Electronics & Lifestyle Engineered for Precision.
            </h1>
            <p className="text-slate-300 text-lg max-w-xl font-normal leading-relaxed">
              Experience lightning-fast express delivery, genuine multi-vendor warranties, and instantaneous checkout via Razorpay & Stripe.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link
                href="/products/aura-pro-5g-smartphone"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                Shop Aura Pro 5G <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#catalog"
                className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3.5 rounded-xl border border-white/10 transition-colors"
              >
                Browse All 50+ Products
              </a>
            </div>
          </div>
          <div className="col-span-5 relative flex justify-center">
            <div className="w-84 h-84 rounded-3xl bg-indigo-500/10 border border-indigo-400/20 backdrop-blur-xl p-6 shadow-2xl relative">
              <img
                src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80"
                alt="Featured Drop"
                className="w-full h-full object-cover rounded-2xl shadow-inner"
              />
              <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 px-4 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  ₹10k
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Save Today</div>
                  <div className="text-sm font-extrabold text-slate-900">Aura Pro 5G Deal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Badges */}
      <section className="bg-white border-b border-slate-200 py-6 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-6 text-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">Same-Day Delivery</div>
              <div className="text-xs text-slate-500">Live GPS tracking by partner agents</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">100% Genuine Brands</div>
              <div className="text-xs text-slate-500">Direct from verified distributors</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">7-Day Free Returns</div>
              <div className="text-xs text-slate-500">Doorstep pickup & instant refunds</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">4.9 / 5.0 Star Rating</div>
              <div className="text-xs text-slate-500">Over 10,000+ verified customer reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog with Filters Sidebar */}
      <main id="catalog" className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full grid grid-cols-12 gap-8">
        {/* Filters Sidebar */}
        <aside className="col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-900 text-base">Categories</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat}</span>
                </button>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Price Range</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="₹ Min"
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="₹ Max"
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span>In-Stock Items Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="col-span-9 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">
              {selectedCategory === 'All' ? 'All Curated Products' : selectedCategory} ({filteredProducts.length})
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="featured">Featured First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to High</option>
                <option value="rating">Highest Customer Rating</option>
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
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow">
                        {discount}% OFF
                      </span>
                    )}

                    {/* Instagram Share Link Button */}
                    <button
                      onClick={() => handleShare(product)}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur hover:bg-white text-slate-700 hover:text-pink-600 p-2 rounded-full shadow transition-colors"
                      title="Generate Instagram Story/Post Share Link with UTM & Captions"
                    >
                      {copiedId === product.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                        {product.category}
                      </div>
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2"
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
                          <div className="text-xs text-slate-400 line-through">
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
                            sku: `SF-${product.slug.toUpperCase().slice(0, 8)}`,
                            price: product.price,
                            compareAtPrice: product.compareAtPrice,
                            quantity: 1,
                            image: product.image,
                          })
                        }
                        className="bg-slate-900 hover:bg-indigo-600 text-white p-2.5 rounded-xl shadow transition-colors flex items-center gap-1.5 text-xs font-semibold"
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
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-slate-900 text-base">Your Cart ({items.length})</h3>
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
                  <ShoppingBag className="w-12 h-12 mx-auto stroke-1" />
                  <p className="font-semibold text-sm">Your cart is empty.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 border-b border-slate-100 pb-4">
                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover bg-slate-100" />
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</div>
                      <div className="text-xs font-semibold text-indigo-600 mt-0.5">₹{item.price.toLocaleString('en-IN')}</div>
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
              <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold">₹{getSubtotal().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Estimated GST (18%):</span>
                  <span>₹{Math.round(getSubtotal() * 0.18).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount:</span>
                  <span className="text-indigo-600">₹{getGrandTotal().toLocaleString('en-IN')}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm transition-all"
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
