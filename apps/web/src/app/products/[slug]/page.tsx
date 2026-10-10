'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, Truck, RefreshCw, ShoppingBag, Heart, Share2, Check, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { DesktopHeader } from '../../../components/desktop/DesktopHeader';
import { MobileBottomNav } from '../../../components/mobile/MobileBottomNav';
import { useCartStore } from '../../../store/useCartStore';

const productDetails = {
  id: 'sf-prod-1',
  title: 'Aura Pro 5G Flagship Smartphone',
  slug: 'aura-pro-5g-smartphone',
  description:
    'Experience supreme engineering with the Aura Pro 5G. Featuring an ultra-vivid 120Hz LTPO AMOLED display, flagship Snapdragon processor, Sony 50MP triple camera system with optical stabilization, and 120W HyperCharge fast-charging capability. Encased in aerospace-grade aluminum and IP68 water resistance.',
  price: 69999,
  compareAtPrice: 79999,
  rating: 4.9,
  reviewCount: 142,
  images: [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1000&auto=format&fit=crop&q=80',
  ],
  variants: [
    { id: 'v-1', name: '12GB RAM + 256GB Storage', price: 69999, compareAtPrice: 79999, sku: 'SF-AURA-12-256' },
    { id: 'v-2', name: '16GB RAM + 512GB Storage', price: 77999, compareAtPrice: 87999, sku: 'SF-AURA-16-512' },
  ],
  specs: [
    { label: 'Display', value: '6.78" 1.5K 120Hz LTPO AMOLED, 4500 nits' },
    { label: 'Processor', value: 'Qualcomm Snapdragon 8 Gen 3 (4nm)' },
    { label: 'Camera', value: '50MP Sony IMX890 OIS + 50MP Ultra-wide + 64MP 3x Periscope' },
    { label: 'Battery', value: '5400 mAh with 120W GaN SuperCharge' },
    { label: 'Protection', value: 'Corning Gorilla Glass Armor + IP68' },
  ],
};

export default function ProductDetailPage() {
  const isMobile = useIsMobile();
  const [selectedVariant, setSelectedVariant] = useState(productDetails.variants[0]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);
  const { addItem, setIsOpen } = useCartStore();

  const handleShare = async () => {
    try {
      const res = await fetch('http://localhost:4000/share/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: productDetails.id, platform: 'instagram' }),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        await navigator.clipboard.writeText(data.readyCaption);
      } else {
        await navigator.clipboard.writeText(
          `✨ NEW DROP: ${productDetails.title} for ₹${selectedVariant.price.toLocaleString('en-IN')}! 🛒 Visit http://localhost:3000/products/${productDetails.slug} #shopflow`,
        );
      }
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: `cart-${productDetails.id}-${selectedVariant.id}`,
      variantId: selectedVariant.id,
      productId: productDetails.id,
      title: `${productDetails.title} (${selectedVariant.name})`,
      sku: selectedVariant.sku,
      price: selectedVariant.price,
      compareAtPrice: selectedVariant.compareAtPrice,
      quantity: 1,
      image: productDetails.images[0],
    });
    setIsOpen(true);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productDetails.title,
    description: productDetails.description,
    image: productDetails.images,
    sku: selectedVariant.sku,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: selectedVariant.price,
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: productDetails.rating,
      reviewCount: productDetails.reviewCount,
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-28 md:pb-12">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {!isMobile && <DesktopHeader />}

      {/* Mobile Top Navigation */}
      {isMobile && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="p-1 rounded-full hover:bg-slate-100 text-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-bold text-sm text-slate-800 truncate max-w-[200px]">
            {productDetails.title}
          </span>
          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-700"
            title="Share on Instagram"
          >
            {copiedShare ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
          </button>
        </header>
      )}

      {/* Main Product Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        {/* Gallery Section */}
        <div className="md:col-span-6 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm relative group">
            <img
              src={productDetails.images[selectedImage]}
              alt={productDetails.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 cursor-crosshair"
            />
            <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow-md">
              In Stock · Express Delivery
            </span>
          </div>

          <div className="flex gap-3">
            {productDetails.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedImage === idx ? 'border-indigo-600 shadow-md ring-2 ring-indigo-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="md:col-span-6 space-y-6">
          <div>
            <div className="text-xs font-extrabold uppercase text-indigo-600 tracking-wider">Smartphones & Flagships</div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 mt-1 tracking-tight">
              {productDetails.title}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-amber-500 text-sm font-bold">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400 mr-1" />
                <span>{productDetails.rating}</span>
              </div>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-semibold">{productDetails.reviewCount} Verified Customer Reviews</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-baseline gap-4">
            <span className="text-3xl md:text-4xl font-black text-slate-900">
              ₹{selectedVariant.price.toLocaleString('en-IN')}
            </span>
            <span className="text-lg text-slate-400 line-through">
              ₹{selectedVariant.compareAtPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Save ₹{(selectedVariant.compareAtPrice - selectedVariant.price).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Variant Matrix */}
          <div className="space-y-3">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Select Configuration</span>
            <div className="grid grid-cols-2 gap-3">
              {productDetails.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedVariant.id === variant.id
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{variant.name}</div>
                  <div className="text-sm font-black text-indigo-600 mt-1">₹{variant.price.toLocaleString('en-IN')}</div>
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed font-normal">{productDetails.description}</p>

          {/* Technical Specifications */}
          <div className="border border-slate-200 bg-white rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Key Specifications</h4>
            <div className="space-y-2 text-xs">
              {productDetails.specs.map((s) => (
                <div key={s.label} className="flex justify-between py-1 border-b border-slate-100 last:border-none">
                  <span className="text-slate-500 font-medium">{s.label}</span>
                  <span className="text-slate-900 font-bold text-right">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Add to Cart & Share Actions */}
          {!isMobile && (
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 text-base transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleShare}
                className="px-6 py-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-2 text-sm shadow-sm transition-colors"
                title="Generate Instagram Story/Post Share Link with UTM & Captions"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600">Caption Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Instagram Share</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Sticky Add to Cart Bottom Bar */}
      {isMobile && (
        <div className="fixed bottom-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="text-[10px] text-slate-400 font-bold">Total Price</div>
            <div className="text-lg font-black text-slate-900">₹{selectedVariant.price.toLocaleString('en-IN')}</div>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-indigo-600 active:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      )}

      {isMobile && <MobileBottomNav />}
    </div>
  );
}
