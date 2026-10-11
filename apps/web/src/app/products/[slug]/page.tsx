'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, Truck, RefreshCw, ShoppingBag, Heart, Share2, Check, ArrowLeft, Leaf, Award } from 'lucide-react';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { DesktopHeader } from '../../../components/desktop/DesktopHeader';
import { MobileBottomNav } from '../../../components/mobile/MobileBottomNav';
import { useCartStore } from '../../../store/useCartStore';

const productDetails = {
  id: 'vd-prod-1',
  title: 'Swarna Bhasma Amrit Chyawanprash with Wild Forest Amla (1kg)',
  slug: 'swarna-bhasma-chyawanprash-1kg',
  description:
    'Experience the pinnacle of classical Rasayana therapy. Handcrafted strictly according to Charaka Samhita classical texts using wild-harvested Indian Gooseberries (Amla), pure 24K Gold Bhasma, A2 Gir Cow Cultured Ghee, raw forest honey, and 42 therapeutic botanicals including Ashwagandha, Shatavari, and Pippali. Enhances Ojas (vitality), ignites Agni (metabolic fire), and supports deep cellular immunity. 100% Non-Pharma herbal medicine, heavy-metal screened and AYUSH certified.',
  price: 1499,
  compareAtPrice: 1799,
  rating: 4.95,
  reviewCount: 218,
  images: [
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=1000&auto=format&fit=crop&q=80',
  ],
  variants: [
    { id: 'v-1', name: '1kg Sealed Glass Jar (Family Pack)', price: 1499, compareAtPrice: 1799, sku: 'VD-CHYAWAN-1KG' },
    { id: 'v-2', name: '500g Glass Jar (Trial Pack)', price: 849, compareAtPrice: 999, sku: 'VD-CHYAWAN-500G' },
  ],
  specs: [
    { label: 'Key Botanicals', value: 'Wild Forest Amla, 24K Gold Bhasma, Ashwagandha, Shatavari, Pippali' },
    { label: 'Dosha Impact', value: 'Tridoshic (Balances Vata, Pitta & Kapha simultaneously)' },
    { label: 'Processing Base', value: 'A2 Gir Cow Cultured Bilona Ghee & Raw Forest Honey' },
    { label: 'Dosage Recommendation', value: '1 to 2 teaspoons twice daily with warm A2 milk or water' },
    { label: 'Certifications', value: 'AYUSH Premium Certified · Zero Heavy Metals · GMP Compliant' },
    { label: 'Classification', value: '100% Non-Pharma Classical Ayurvedic Medicine' },
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
          `🌿 PURE AYURVEDA: ${productDetails.title} for only ₹${selectedVariant.price.toLocaleString('en-IN')}! 🌿 100% Non-Pharma AYUSH certified. Check it out at: http://localhost:3005/products/${productDetails.slug} #ayurveda #pureherbs`,
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
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col pb-28 md:pb-12 text-slate-800">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {!isMobile && <DesktopHeader />}

      {/* Mobile Top Navigation */}
      {isMobile && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="p-1 rounded-full hover:bg-emerald-50 text-slate-700">
            <ArrowLeft className="w-5 h-5 text-emerald-800" />
          </Link>
          <span className="font-bold text-xs text-slate-800 truncate max-w-[200px]">
            {productDetails.title}
          </span>
          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-emerald-50 text-slate-700"
            title="Share on Instagram"
          >
            {copiedShare ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5 text-emerald-800" />}
          </button>
        </header>
      )}

      {/* Main Product Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        {/* Gallery Section */}
        <div className="md:col-span-6 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-emerald-100 shadow-sm relative group">
            <img
              src={productDetails.images[selectedImage]}
              alt={productDetails.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 cursor-crosshair"
            />
            <span className="absolute top-4 left-4 bg-emerald-800 text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-amber-200" /> AYUSH Certified · Non-Pharma
            </span>
          </div>

          <div className="flex gap-3">
            {productDetails.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedImage === idx ? 'border-emerald-700 shadow-md ring-2 ring-emerald-200' : 'border-slate-200 opacity-70 hover:opacity-100'
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
            <div className="text-xs font-extrabold uppercase text-emerald-700 tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Classical Rasayanas & Rejuvenators
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 tracking-tight">
              {productDetails.title}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-amber-500 text-sm font-bold">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400 mr-1" />
                <span>{productDetails.rating}</span>
              </div>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-semibold">{productDetails.reviewCount} Verified Patient Reviews</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs flex items-baseline gap-4">
            <span className="text-3xl md:text-4xl font-black text-slate-900">
              ₹{selectedVariant.price.toLocaleString('en-IN')}
            </span>
            <span className="text-lg text-slate-400 line-through">
              ₹{selectedVariant.compareAtPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Save ₹{(selectedVariant.compareAtPrice - selectedVariant.price).toLocaleString('en-IN')} (20% OFF)
            </span>
          </div>

          {/* Variant Matrix */}
          <div className="space-y-3">
            <span className="font-bold text-xs uppercase tracking-wider text-emerald-800">Choose Size & Packaging</span>
            <div className="grid grid-cols-2 gap-3">
              {productDetails.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedVariant.id === variant.id
                      ? 'border-emerald-700 bg-emerald-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{variant.name}</div>
                  <div className="text-sm font-black text-emerald-700 mt-1">₹{variant.price.toLocaleString('en-IN')}</div>
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">{productDetails.description}</p>

          {/* Botanical Specifications */}
          <div className="border border-emerald-100 bg-white rounded-3xl p-5 space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-800">Classical Botanical Profile</h4>
            <div className="space-y-2 text-xs">
              {productDetails.specs.map((s) => (
                <div key={s.label} className="flex justify-between py-1.5 border-b border-slate-100 last:border-none">
                  <span className="text-slate-500 font-medium">{s.label}</span>
                  <span className="text-slate-900 font-bold text-right max-w-xs">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Add to Cart & Share Actions */}
          {!isMobile && (
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-800/25 flex items-center justify-center gap-2 text-base transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Herbal Cart
              </button>
              <button
                onClick={handleShare}
                className="px-6 py-4 rounded-2xl border border-emerald-200 bg-white hover:bg-emerald-50 text-slate-700 font-bold flex items-center gap-2 text-sm shadow-sm transition-colors"
                title="Generate Instagram Story/Post Share Link with UTM & Captions"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600">Caption Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-emerald-700" />
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
        <div className="fixed bottom-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-100 px-4 py-3 flex items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="text-[10px] text-slate-400 font-bold">Total Price</div>
            <div className="text-lg font-black text-slate-900">₹{selectedVariant.price.toLocaleString('en-IN')}</div>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-emerald-800 active:bg-emerald-900 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Herbal Cart
          </button>
        </div>
      )}

      {isMobile && <MobileBottomNav />}
    </div>
  );
}
