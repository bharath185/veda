'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingCart,
  Heart,
  Share2,
  Check,
  ArrowLeft,
  Leaf,
  Award,
  Zap,
  Tag,
  MapPin,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { DesktopHeader } from '../../../components/desktop/DesktopHeader';
import { MobileBottomNav } from '../../../components/mobile/MobileBottomNav';
import { useCartStore } from '../../../store/useCartStore';
import { useCatalogStore } from '../../../store/useCatalogStore';
import { getProductBySlug, allAyurvedicProducts } from '../../../data/ayurvedaCatalog';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const isMobile = useIsMobile();
  const { addItem, setIsOpen } = useCartStore();
  const { products } = useCatalogStore();

  const slug = (params?.slug as string) || '';

  // Dynamic Product Resolution - checks live catalog store first, then fallback
  const catalogItem = useMemo(() => {
    return (
      products.find((p) => p.slug === slug || p.id === slug) ||
      getProductBySlug(slug) ||
      products[0] ||
      allAyurvedicProducts[0]
    );
  }, [products, slug]);

  // Dynamic rich details for the PDP
  const productDetails = useMemo(() => {
    return {
      id: catalogItem.id,
      title: catalogItem.title,
      slug: catalogItem.slug,
      categoryName: catalogItem.categoryName,
      categorySlug: catalogItem.categorySlug,
      breadcrumb: ['Home', 'Ayurvedic Remedies', catalogItem.categoryName, catalogItem.title],
      description: catalogItem.description,
      price: catalogItem.price,
      compareAtPrice: catalogItem.compareAtPrice,
      discountPct: catalogItem.discountPct,
      rating: catalogItem.rating,
      ratingsCount: catalogItem.reviews * 3 + 240,
      reviewsCount: catalogItem.reviews,
      images: [
        catalogItem.image,
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1000&auto=format&fit=crop&q=80',
      ],
      variants: [
        {
          id: `${catalogItem.id}-v1`,
          name: 'Standard Therapeutic Pack',
          price: catalogItem.price,
          compareAtPrice: catalogItem.compareAtPrice,
          discountPct: catalogItem.discountPct,
          sku: `${catalogItem.id.toUpperCase()}-STD`,
        },
        {
          id: `${catalogItem.id}-v2`,
          name: 'Economy Duo Pack (2x Course)',
          price: Math.round(catalogItem.price * 1.85),
          compareAtPrice: Math.round(catalogItem.compareAtPrice * 1.9),
          discountPct: catalogItem.discountPct + 5,
          sku: `${catalogItem.id.toUpperCase()}-DUO`,
        },
      ],
      offers: [
        { type: 'Bank Offer', text: '5% Unlimited Cashback on Flipkart Axis Bank Card', link: 'T&C' },
        { type: 'Bank Offer', text: '10% Instant Discount on SBI Cards on Ayurvedic remedies above ₹1,499', link: 'T&C' },
        { type: 'Special Price', text: `Get extra ${catalogItem.discountPct}% off on classical formulations`, link: 'T&C' },
        { type: 'Herbal Guide', text: 'Complimentary authentic Ayurvedic usage and storage guide with order', link: 'View' },
      ],
      highlights: [
        '100% Non-Pharma Classical Ayurvedic Medicine',
        `Formulated strictly per: ${catalogItem.classicalText}`,
        `Formulation Type: ${catalogItem.formulationType}`,
        'Zero synthetic colors, artificial binders, or chemical preservatives',
        'AYUSH Certified & NABL heavy-metal screened',
        `Prescribed Dosage: ${catalogItem.dosage}`,
      ],
      specs: [
        { key: 'In The Box', val: `1 Container of ${catalogItem.title}, Measuring Cap/Spoon, AYUSH Lab Certificate` },
        { key: 'Classical Text Reference', val: catalogItem.classicalText },
        { key: 'Herbal Ingredients / Tags', val: catalogItem.tags.join(', ') },
        { key: 'Formulation Category', val: `${catalogItem.categoryName} (${catalogItem.formulationType})` },
        { key: 'Recommended Dosage', val: catalogItem.dosage },
        { key: 'Target Dosha Harmony', val: 'Vata-Pitta-Kapha equilibrium support' },
        { key: 'NABL Lab Testing', val: 'Batch VD-2026-AYUR-PASS (Zero Lead, Mercury, Arsenic or Cadmium)' },
        { key: 'Shelf Life', val: '24 Months from manufacturing date' },
        { key: 'Manufacturer', val: 'Kerala Veda Botanical Pharmacy & Research Institute (AYUSH License #GA/1482)' },
      ],
      reviews: [
        {
          user: 'Anand Joshi (Verified Buyer, Pune)',
          rating: 5,
          date: '10 days ago',
          title: 'Authentic classical potency',
          comment: `Remarkable herbal purity adhering to ${catalogItem.classicalText}. Noticeable therapeutic relief and zero unwanted after-effects.`,
        },
        {
          user: 'Priya Sharma (Verified Buyer, Bangalore)',
          rating: 5,
          date: '2 weeks ago',
          title: 'High quality and fast delivery',
          comment: 'Very pleased with the packaging and purity. Arrived in under 24 hours with NABL batch certification.',
        },
      ],
    };
  }, [catalogItem]);

  const [selectedVariant, setSelectedVariant] = useState(productDetails.variants[0]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [pincode, setPincode] = useState('560001');
  const [pincodeChecked, setPincodeChecked] = useState(true);
  const [copiedShare, setCopiedShare] = useState(false);

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

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const handleShare = async () => {
    try {
      const textToCopy = `🌿 PURE AYURVEDA: ${productDetails.title} for only ₹${selectedVariant.price.toLocaleString('en-IN')}! 🌿 100% Non-Pharma AYUSH certified. Check it out at: ${typeof window !== 'undefined' ? window.location.href : `/products/${productDetails.slug}`} #ayurveda #pureherbs #nonpharmamedicine`;
      await navigator.clipboard.writeText(textToCopy);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f2f4] text-slate-800 font-sans flex flex-col justify-between">
      {/* Flipkart Header */}
      <DesktopHeader />

      <main className="max-w-7xl mx-auto w-full px-2 sm:px-4 py-3">
        {/* Flipkart PDP Container */}
        <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Sticky Image Gallery + Dual Buttons (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="sticky top-28 space-y-4">
              <div className="flex gap-4">
                {/* Thumbnails vertical rail */}
                <div className="flex flex-col gap-2 shrink-0">
                  {productDetails.images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onMouseEnter={() => setSelectedImage(i)}
                      onClick={() => setSelectedImage(i)}
                      className={`w-14 h-14 rounded-xs border p-1 overflow-hidden transition-all ${
                        selectedImage === i ? 'border-[#2874f0] ring-1 ring-[#2874f0]' : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Big Main Image Container */}
                <div className="flex-1 h-80 sm:h-96 border border-slate-100 rounded-sm p-4 relative flex items-center justify-center group overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="absolute top-3 right-3 p-2 rounded-full border border-slate-200 bg-white shadow-xs text-slate-400 hover:text-red-500 z-10 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'fill-none'}`} />
                  </button>

                  <img
                    src={productDetails.images[selectedImage]}
                    alt={productDetails.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Flipkart Dual Sticky Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="bg-[#ff9f00] hover:bg-[#f39700] text-white font-black py-3.5 px-4 rounded-xs text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
                >
                  <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                  <span>Add To Cart</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="bg-[#fb641b] hover:bg-[#e85a14] text-white font-black py-3.5 px-4 rounded-xs text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
                >
                  <Zap className="w-4 h-4 stroke-[2.5] fill-white" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Instagram & Social Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2 px-3 rounded-xs text-xs flex items-center justify-center gap-2 transition-colors"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Ayurvedic Share Caption & Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-[#2874f0]" />
                    <span>Copy Share Caption for WhatsApp & Instagram</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Details, Offers, Specs, Reviews (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
              {productDetails.breadcrumb.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
                  <span className={idx === productDetails.breadcrumb.length - 1 ? 'text-slate-800 font-bold' : 'hover:underline cursor-pointer'}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-slate-900 leading-snug">
              {productDetails.title}
            </h1>

            {/* Ratings & Veda-Assured */}
            <div className="flex items-center gap-3">
              <span className="bg-[#388e3c] text-white text-xs font-black px-2 py-0.5 rounded-xs flex items-center gap-1">
                <span>{productDetails.rating}</span>
                <Star className="w-3 h-3 fill-white" />
              </span>
              <span className="text-xs font-bold text-slate-500">
                {productDetails.ratingsCount.toLocaleString('en-IN')} Ratings & {productDetails.reviewsCount.toLocaleString('en-IN')} Reviews
              </span>
              {/* Veda-Assured Badge */}
              <span className="flex items-center bg-[#2874f0] text-white text-[10px] font-black italic px-1.5 py-0.5 rounded-xs tracking-tighter" title="100% Genuine Lab-Tested Herbal Guarantee">
                Veda<span className="text-[#ffe500]">✓</span>
              </span>
            </div>

            {/* Special Price Badge */}
            <div className="text-xs font-black text-[#388e3c] tracking-wide">
              Special price
            </div>

            {/* Price Block */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                ₹{selectedVariant.price.toLocaleString('en-IN')}
              </span>
              <span className="text-base text-slate-400 line-through">
                ₹{selectedVariant.compareAtPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-base font-bold text-[#388e3c]">
                {selectedVariant.discountPct}% off
              </span>
            </div>

            {/* Pack Size / Variant Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-600">Select Packaging:</label>
              <div className="flex flex-wrap gap-2.5">
                {productDetails.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3 py-2 text-xs font-bold rounded-xs border transition-all ${
                      selectedVariant.id === v.id
                        ? 'border-[#2874f0] text-[#2874f0] bg-blue-50/40 ring-1 ring-[#2874f0]'
                        : 'border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div>{v.name}</div>
                    <div className="text-[11px] font-black mt-0.5">₹{v.price.toLocaleString('en-IN')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Classical Description */}
            <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xs space-y-1">
              <div className="text-[11px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-amber-700" />
                <span>Classical Ayurvedic Formulation Summary</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {productDetails.description}
              </p>
            </div>

            {/* Flipkart Available Offers */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                Available Offers
              </h3>
              <div className="space-y-2 text-xs">
                {productDetails.offers.map((offer, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#388e3c] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">{offer.type}: </span>
                      <span className="text-slate-600 font-medium">{offer.text} </span>
                      <span className="font-bold text-[#2874f0] hover:underline cursor-pointer">{offer.link}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Pincode Checker */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#2874f0]" />
                  <span>Delivery</span>
                </span>
                <div className="flex items-center border-b-2 border-[#2874f0] pb-0.5">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter Pincode"
                    className="text-xs font-bold text-slate-900 focus:outline-none w-28 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setPincodeChecked(true)}
                    className="text-xs font-bold text-[#2874f0] hover:underline ml-2"
                  >
                    Check
                  </button>
                </div>
              </div>

              {pincodeChecked && (
                <div className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Delivery by <strong>Tomorrow, 7 PM</strong> | Free delivery on herbal medicines</span>
                </div>
              )}
            </div>

            {/* Highlights */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                Key Highlights
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {productDetails.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications Table */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Product Specifications
              </h3>
              <div className="border border-slate-200 rounded-sm overflow-hidden text-xs">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-200">
                    {productDetails.specs.map((s, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                        <td className="p-3 w-1/3 font-bold text-slate-500">{s.key}</td>
                        <td className="p-3 text-slate-800 font-medium">{s.val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ratings & Reviews breakdown */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Ratings & Reviews
                </h3>
                <span className="text-xs font-bold text-[#2874f0] cursor-pointer hover:underline">
                  Rate Product
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-sm border border-slate-200 flex items-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-black text-slate-900 flex items-center justify-center gap-1">
                    <span>{productDetails.rating}</span>
                    <Star className="w-6 h-6 fill-[#388e3c] text-[#388e3c]" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold mt-1">
                    {productDetails.ratingsCount.toLocaleString('en-IN')} Ratings & {productDetails.reviewsCount.toLocaleString('en-IN')} Reviews
                  </div>
                </div>

                <div className="flex-1 space-y-1 text-xs">
                  {[
                    { stars: 5, pct: '82%' },
                    { stars: 4, pct: '14%' },
                    { stars: 3, pct: '3%' },
                    { stars: 2, pct: '1%' },
                    { stars: 1, pct: '0%' },
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-2">
                      <span className="w-3 text-slate-600 font-bold">{row.stars}★</span>
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#388e3c]" style={{ width: row.pct }} />
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium w-8">{row.pct}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample User Testimonial */}
              <div className="space-y-3 pt-2">
                {productDetails.reviews.map((rev, idx) => (
                  <div key={idx} className="border-b border-slate-200 pb-3 space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-xs flex items-center gap-0.5">
                        <span>{rev.rating}</span>
                        <Star className="w-2.5 h-2.5 fill-white" />
                      </span>
                      <span className="font-bold text-slate-800">{rev.title}</span>
                    </div>
                    <p className="text-slate-600">{rev.comment}</p>
                    <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 pt-1">
                      <span>{rev.user}</span>
                      <span>·</span>
                      <span>{rev.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
}
