'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  Star,
  ShoppingCart,
  Heart,
  ChevronRight,
  Filter,
  Check,
  Truck,
  Leaf,
  ShieldCheck,
  ArrowUpDown,
  SlidersHorizontal,
} from 'lucide-react';
import { DesktopHeader } from '../../../components/desktop/DesktopHeader';
import { MobileBottomNav } from '../../../components/mobile/MobileBottomNav';
import { useCartStore } from '../../../store/useCartStore';
import { useCatalogStore } from '../../../store/useCatalogStore';
import {
  ayurvedaCategories,
  AyurvedicProduct,
} from '../../../data/ayurvedaCatalog';

function CategoryPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || 'classical-rasayanas';
  const queryParam = searchParams?.get('q') || '';

  const { products, categories } = useCatalogStore();

  const category = useMemo(() => {
    return (
      categories.find((c) => c.slug === slug) || {
        name: queryParam ? `Search: "${queryParam}"` : 'Classical Ayurvedic Remedies',
        slug: 'all',
        icon: '🌿',
        description: 'Authentic Charaka Samhita verified classical Ayurvedic formulations, pure extracts, and health supplements.',
        count: products.length,
        bannerGradient: 'from-[#0057b7] via-[#2874f0] to-[#0a84ff]',
      }
    );
  }, [slug, categories, products.length, queryParam]);

  const rawProducts = useMemo(() => {
    let list = products;
    if (slug && slug !== 'all' && slug !== 'all-deals') {
      const filtered = list.filter((p) => p.categorySlug === slug);
      if (filtered.length > 0) {
        list = filtered;
      }
    }
    if (queryParam.trim()) {
      const q = queryParam.toLowerCase().trim();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        (p as any).classicalText?.toLowerCase().includes(q) ||
        (p as any).classicalReference?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, slug, queryParam]);

  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [wishlisted, setWishlisted] = useState<Record<string, boolean>>({});
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const { addItem } = useCartStore();

  const toggleWishlist = (id: string) => {
    setWishlisted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts = useMemo(() => {
    let result = rawProducts.filter((p) => {
      if (p.price > maxPrice) return false;
      if (minRating > 0 && p.rating < minRating) return false;
      if (inStockOnly && !p.inStock) return false;
      return true;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [rawProducts, sortBy, minRating, maxPrice, inStockOnly]);

  return (
    <div className="min-h-screen bg-[#f1f2f4] text-slate-800 font-sans flex flex-col justify-between">
      {/* Flipkart Header */}
      <DesktopHeader />

      <main className="max-w-7xl mx-auto w-full px-2 sm:px-4 py-3 space-y-3">
        {/* Breadcrumb Bar */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-white px-4 py-2.5 rounded-sm shadow-xs border border-slate-200">
          <Link href="/" className="hover:text-[#2874f0]">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/categories" className="hover:text-[#2874f0]">
            Ayurvedic Remedies
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-900">{category.name}</span>
          <span className="ml-auto text-[11px] text-slate-400">
            ({filteredProducts.length} classical formulations found)
          </span>
        </div>

        {/* Category Header Banner */}
        <div className="bg-gradient-to-r from-[#172337] via-[#2874f0] to-[#1e3a8a] text-white p-6 rounded-sm shadow-sm space-y-2 relative overflow-hidden">
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{category.icon}</span>
                <span className="bg-[#ffe500] text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-2xs">
                  100% Non-Pharma AYUSH Certified
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{category.name}</h1>
              <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
                {category.description}
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-xs text-blue-200 font-bold">Veda-Assured</span>
              <span className="text-xl font-mono font-black text-[#ffe500]">Zero Heavy Metals</span>
              <span className="text-[10px] text-blue-200">Charaka & Sushruta Samhita verified</span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Grid: Filters Sidebar (3 cols) + Product Grid (9 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* LEFT COLUMN: Flipkart Filter Sidebar (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-slate-200 rounded-sm shadow-xs p-4 space-y-5 sticky top-28">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-[#2874f0]" />
                <span>Filters</span>
              </h2>
              <button
                type="button"
                onClick={() => {
                  setMinRating(0);
                  setMaxPrice(2000);
                  setInStockOnly(false);
                  setSortBy('popular');
                }}
                className="text-xs font-bold text-[#2874f0] hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Price Slider Filter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Max Price:</span>
                <span className="text-[#2874f0] font-black">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="200"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#2874f0] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>₹200</span>
                <span>₹1,000</span>
                <span>₹2,000</span>
              </div>
            </div>

            {/* Customer Rating Filter */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider">
                Customer Ratings
              </label>
              <div className="space-y-1.5 text-xs font-semibold text-slate-700">
                {[
                  { label: '4.5 ★ & above', val: 4.5 },
                  { label: '4.0 ★ & above', val: 4.0 },
                  { label: 'All Ratings', val: 0 },
                ].map((r) => (
                  <label key={r.val} className="flex items-center gap-2 cursor-pointer hover:text-[#2874f0]">
                    <input
                      type="radio"
                      name="minRating"
                      checked={minRating === r.val}
                      onChange={() => setMinRating(r.val)}
                      className="accent-[#2874f0]"
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* In Stock Only */}
            <div className="border-t border-slate-100 pt-3">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded-2xs accent-[#2874f0]"
                />
                <span>In-Stock Remedies Only</span>
              </label>
            </div>

            {/* Other Categories Links */}
            <div className="border-t border-slate-100 pt-3 space-y-1.5">
              <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
                Browse Other Remedies
              </label>
              <div className="space-y-1 text-xs">
                {ayurvedaCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/categories/${c.slug}`}
                    className={`block py-1 px-2 rounded-xs transition-colors ${
                      c.slug === slug
                        ? 'bg-blue-50 text-[#2874f0] font-black'
                        : 'text-slate-600 hover:text-[#2874f0] hover:bg-slate-50 font-semibold'
                    }`}
                  >
                    <span className="mr-1.5">{c.icon}</span>
                    <span>{c.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: Product Grid & Sorting Toolbar (9 cols) */}
          <div className="lg:col-span-9 space-y-3">
            {/* Sorting Toolbar (Flipkart Style Sort Strip) */}
            <div className="bg-white border border-slate-200 rounded-sm shadow-xs p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <span className="uppercase tracking-wider text-slate-500 font-bold">Sort By:</span>
                <button
                  type="button"
                  onClick={() => setSortBy('popular')}
                  className={`px-2.5 py-1 rounded-xs transition-colors ${
                    sortBy === 'popular'
                      ? 'border-b-2 border-[#2874f0] text-[#2874f0] font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Popularity
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('price-asc')}
                  className={`px-2.5 py-1 rounded-xs transition-colors ${
                    sortBy === 'price-asc'
                      ? 'border-b-2 border-[#2874f0] text-[#2874f0] font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Price -- Low to High
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('price-desc')}
                  className={`px-2.5 py-1 rounded-xs transition-colors ${
                    sortBy === 'price-desc'
                      ? 'border-b-2 border-[#2874f0] text-[#2874f0] font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Price -- High to Low
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('rating')}
                  className={`px-2.5 py-1 rounded-xs transition-colors ${
                    sortBy === 'rating'
                      ? 'border-b-2 border-[#2874f0] text-[#2874f0] font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Customer Rating
                </button>
              </div>

              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setShowMobileFilter(!showMobileFilter)}
                className="lg:hidden flex items-center gap-1.5 bg-slate-100 text-slate-800 font-bold px-3 py-1.5 rounded-xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#2874f0]" />
                <span>Filters</span>
              </button>
            </div>

            {/* Mobile Filter Drawer */}
            {showMobileFilter && (
              <div className="lg:hidden bg-white border border-slate-200 p-4 rounded-sm space-y-3 text-xs">
                <div className="flex justify-between font-bold">
                  <span>Filter by Max Price: ₹{maxPrice}</span>
                  <button onClick={() => setShowMobileFilter(false)} className="text-[#2874f0]">
                    Done
                  </button>
                </div>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#2874f0]"
                />
              </div>
            )}

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-sm p-12 text-center space-y-3">
                <div className="text-4xl">🍃</div>
                <h3 className="text-base font-bold text-slate-800">No classical remedies match your filter criteria</h3>
                <p className="text-xs text-slate-500">Try adjusting the price slider or clearing your rating filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setMaxPrice(2000);
                    setMinRating(0);
                    setInStockOnly(false);
                  }}
                  className="bg-[#2874f0] text-white font-bold px-4 py-2 rounded-xs text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white border border-slate-200 hover:border-slate-300 rounded-sm p-3.5 flex flex-col justify-between hover:shadow-md transition-all relative"
                  >
                    {/* Wishlist Heart */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2.5 right-2.5 z-10 p-1 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlisted[product.id] ? 'fill-red-500 text-red-500' : 'fill-none'
                        }`}
                      />
                    </button>

                    {/* Image */}
                    <Link
                      href={`/products/${product.slug}`}
                      className="w-full h-44 flex items-center justify-center overflow-hidden mb-2 relative"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Details */}
                    <div className="space-y-1.5">
                      <Link
                        href={`/products/${product.slug}`}
                        className="block text-xs font-bold text-slate-800 hover:text-[#2874f0] line-clamp-2 leading-tight h-8"
                        title={product.title}
                      >
                        {product.title}
                      </Link>

                      {/* Ratings & Veda✓ Assured Badge */}
                      <div className="flex items-center gap-1.5">
                        <span className="bg-[#388e3c] text-white text-[10px] font-black px-1.5 py-0.5 rounded-2xs flex items-center gap-0.5">
                          <span>{product.rating}</span>
                          <Star className="w-2.5 h-2.5 fill-white" />
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          ({product.reviews.toLocaleString('en-IN')})
                        </span>
                        <span
                          className="ml-auto flex items-center bg-[#2874f0] text-white text-[9px] font-black italic px-1 rounded-2xs tracking-tighter"
                          title="100% Genuine Lab-Tested Herbal Guarantee"
                        >
                          Veda<span className="text-[#ffe500]">✓</span>
                        </span>
                      </div>

                      {/* Price Row */}
                      <div className="flex items-baseline gap-1.5 pt-0.5">
                        <span className="text-base font-black text-slate-900">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₹{product.compareAtPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs font-bold text-[#388e3c]">
                          {product.discountPct}% off
                        </span>
                      </div>

                      {/* Delivery & Classical Text */}
                      <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                        <Truck className="w-3 h-3 text-[#2874f0]" />
                        <span>Free Delivery by Tomorrow</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 mt-2 border-t border-slate-100">
                      <button
                        type="button"
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
                        className="w-full bg-[#ff9f00] hover:bg-[#f39700] text-white text-[11px] font-black py-2 rounded-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add To Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Nav on Mobile */}
      <MobileBottomNav />
    </div>
  );
}

export default function CategoryPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#f1f2f4] flex items-center justify-center font-bold text-slate-500">
          Loading Ayurvedic Remedies...
        </div>
      }
    >
      <CategoryPageContent />
    </React.Suspense>
  );
}
