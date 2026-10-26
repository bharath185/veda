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
  Camera,
  Percent,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  Activity,
  HeartPulse,
} from 'lucide-react';
import { DesktopHeader } from './DesktopHeader';
import { useCartStore } from '../../store/useCartStore';
import { useCatalogStore } from '../../store/useCatalogStore';
import { AyurvedicProduct } from '../../data/ayurvedaCatalog';
import { UploadPrescriptionModal } from '../prescription/UploadPrescriptionModal';

// Truemeds Reference: Chronic Conditions Grid
const chronicHealthConditions = [
  {
    title: 'Diabetes Care',
    hindi: 'मधुमेह नियंत्रण',
    icon: '🩸',
    savings: 'Save up to 51%',
    slug: 'classical-rasayanas',
    keyHerbs: 'Gurmar, Jamun, Vijaysar',
    gradient: 'from-emerald-500/10 to-teal-500/20',
  },
  {
    title: 'Cardiac & BP',
    hindi: 'हृदय व रक्तचाप',
    icon: '❤️',
    savings: 'Save up to 48%',
    slug: 'classical-rasayanas',
    keyHerbs: 'Arjuna Bark, Pushkarmool',
    gradient: 'from-rose-500/10 to-red-500/20',
  },
  {
    title: 'Joint & Arthritis Pain',
    hindi: 'संधिवात व जोड़ दर्द',
    icon: '🦴',
    savings: 'Save up to 53%',
    slug: 'ayurvedic-thailams',
    keyHerbs: 'Shallaki, Mahanarayan Taila',
    gradient: 'from-amber-500/10 to-orange-500/20',
  },
  {
    title: 'Digestion & Gut Care',
    hindi: 'पाचन व उदर रोग',
    icon: '🥣',
    savings: 'Save up to 50%',
    slug: 'churnas-kwath',
    keyHerbs: 'Triphala, Hingwashtak Churna',
    gradient: 'from-blue-500/10 to-indigo-500/20',
  },
  {
    title: 'Liver & Kidney Detox',
    hindi: 'यकृत व वृक्क शोधन',
    icon: '🌿',
    savings: 'Save up to 55%',
    slug: 'churnas-kwath',
    keyHerbs: 'Bhumi Amla, Punarnava',
    gradient: 'from-teal-500/10 to-cyan-500/20',
  },
  {
    title: 'Stress & Deep Sleep',
    hindi: 'तनाव मुक्ति व निद्रा',
    icon: '🧠',
    savings: 'Save up to 52%',
    slug: 'herbal-supplements',
    keyHerbs: 'KSM-66 Ashwagandha, Brahmi',
    gradient: 'from-purple-500/10 to-violet-500/20',
  },
  {
    title: 'Vitality & Stamina',
    hindi: 'ओजस व धातु पुष्टि',
    icon: '⚡',
    savings: 'Save up to 51%',
    slug: 'herbal-supplements',
    keyHerbs: 'Gold Shilajit 24K, Swarna Bhasma',
    gradient: 'from-yellow-500/10 to-amber-500/20',
  },
  {
    title: 'Skin, Hair & Anti-Aging',
    hindi: 'त्वचा व केश सौंदर्य',
    icon: '✨',
    savings: 'Save up to 47%',
    slug: 'botanical-skincare',
    keyHerbs: 'Kumkumadi Tailam, Bhringraj',
    gradient: 'from-pink-500/10 to-rose-500/20',
  },
];

// Truemeds Reference: Smart Substitute / Alternative Comparisons
const substituteComparisons = [
  {
    id: 'sub-1',
    condition: 'Immunity & Chronic Fatigue',
    allopathicBrand: 'Commercial Multivitamin & Energy Capsule',
    allopathicPrice: 980,
    classicalRemedy: 'Swarna Bhasma Amrit Chyawanprash (1kg)',
    classicalSlug: 'swarna-bhasma-chyawanprash-1kg',
    classicalPrice: 479,
    savingsAmount: 501,
    savingsPercent: 51,
    biomoleculeMatch: '24K Gold Bhasma + 52 Botanical Immuno-Modulators',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'sub-2',
    condition: 'Severe Knee & Joint Arthritis',
    allopathicBrand: 'Synthetic Diclofenac Pain Relief Gel / Tablet',
    allopathicPrice: 490,
    classicalRemedy: 'Classical Mahanarayan Shothahara Thailam (200ml)',
    classicalSlug: 'classical-bringadi-intensive-hair-oil-200ml',
    classicalPrice: 245,
    savingsAmount: 245,
    savingsPercent: 50,
    biomoleculeMatch: 'Boswellic Acid + 36 Medicated Root Decocations',
    image: 'https://images.unsplash.com/photo-1608248597359-597597143922?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'sub-3',
    condition: 'Chronic Stress & Restless Sleep',
    allopathicBrand: 'Synthetic Anxiolytic / Sleep Inducer Tablet',
    allopathicPrice: 650,
    classicalRemedy: 'KSM-66 Full-Spectrum Ashwagandha (60 caps)',
    classicalSlug: 'ksm66-organic-ashwagandha-root-extract',
    classicalPrice: 319,
    savingsAmount: 331,
    savingsPercent: 51,
    biomoleculeMatch: '5% Certified Withanolides (GABA Receptor Modulator)',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'sub-4',
    condition: 'Acidity, GERD & Sluggish Digestion',
    allopathicBrand: 'Commercial Omeprazole + Domperidone Antacid',
    allopathicPrice: 420,
    classicalRemedy: 'Organic Triphala & Avipattikar Gut Churna (250g)',
    classicalSlug: 'triphala-churna-organic-250g',
    classicalPrice: 205,
    savingsAmount: 215,
    savingsPercent: 51,
    biomoleculeMatch: 'Bio-Tannins & Natural Anthraquinones',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
  },
];

export function DesktopHome() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [wishlisted, setWishlisted] = useState<Record<string, boolean>>({});
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [activeSubstituteTab, setActiveSubstituteTab] = useState(0);

  const { addItem } = useCartStore();
  const { products, banners, init } = useCatalogStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    init();
  }, [init]);

  const activeBanners = banners.filter((b) => b.active);
  const currentBannerCount = activeBanners.length > 0 ? activeBanners.length : 1;

  useEffect(() => {
    if (currentBannerCount <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % currentBannerCount);
    }, 4500);
    return () => clearInterval(timer);
  }, [currentBannerCount]);

  const toggleWishlist = (id: string) => {
    setWishlisted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = async (product: AyurvedicProduct) => {
    try {
      await navigator.clipboard.writeText(
        `🌿 PURE AYURVEDA WELLNESS: ${product.title} for ₹${product.price.toLocaleString('en-IN')}! 🌿 100% Non-Pharma Herbal Medicine. Shop online: http://localhost:3005/products/${product.slug} #ayurveda #truemeds #save51percent`
      );
      setCopiedId(product.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      setCopiedId(product.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const selectedSub = substituteComparisons[activeSubstituteTab];

  return (
    <div className="min-h-screen bg-[#f1f2f4] text-slate-800 font-sans flex flex-col justify-between">
      {/* 1. Header with Truemeds Top Ribbon & Upload Rx */}
      <DesktopHeader />

      <main className="max-w-7xl mx-auto w-full px-2 sm:px-4 py-3 space-y-4">
        {/* 2. Truemeds Quick Action Rx Upload + Rotating Hero Carousel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          {/* Left Column: Rotating Hero Banner (8 cols) */}
          <div className="lg:col-span-8 relative h-72 rounded-sm overflow-hidden shadow-sm group">
            {activeBanners.map((b, idx) => (
              <div
                key={b.id}
                className={`absolute inset-0 text-white flex flex-col justify-center px-8 sm:px-10 transition-opacity duration-700 ${
                  idx === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                } ${b.imageUrl ? 'bg-slate-900' : `bg-gradient-to-r ${b.bgGradient}`}`}
              >
                {b.imageUrl && (
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                  />
                )}

                <div className="max-w-xl space-y-2.5 relative z-10">
                  <span className="inline-block bg-[#ffe500] text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-2xs shadow-sm tracking-wide">
                    {b.badge || 'SAVE UP TO 51%'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight drop-shadow-sm">
                    {b.title}
                  </h2>
                  <p className="text-xs font-medium text-slate-100 drop-shadow-sm line-clamp-2">
                    {b.subtitle}
                  </p>
                  <div className="pt-2">
                    <Link
                      href={b.link || '/categories'}
                      className="inline-block bg-white hover:bg-slate-100 text-[#128983] font-black px-5 py-2 text-xs rounded-sm shadow-md transition-transform active:scale-95 uppercase tracking-wider"
                    >
                      {b.btnText || 'Explore Formulations'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Carousel Arrows */}
            <button
              onClick={() => setCurrentBanner((prev) => (prev - 1 + currentBannerCount) % currentBannerCount)}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-16 bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center rounded-r-sm shadow-md z-20 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5 stroke-[3]" />
            </button>
            <button
              onClick={() => setCurrentBanner((prev) => (prev + 1) % currentBannerCount)}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-16 bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center rounded-l-sm shadow-md z-20 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>

          {/* Right Column: Truemeds Signature Quick Prescription Order Card (4 cols) */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#0d6e68] to-[#128983] text-white p-5 rounded-sm shadow-sm flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="bg-[#ffe500] text-[#0d6e68] text-[9px] font-black uppercase px-2 py-0.5 rounded-2xs">
                  FASTEST ORDER
                </span>
                <span className="text-[10px] text-teal-100 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ffe500]" /> Triple-Check
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Order Faster With Prescription
              </h3>
              <p className="text-xs text-teal-100 leading-relaxed">
                Upload your doctor&apos;s prescription slip & our expert pharmacists will find 100% composition-matched classical herbal remedies to save you up to 51%.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => setIsRxModalOpen(true)}
                className="w-full bg-[#ffe500] hover:bg-[#edd400] text-slate-900 font-black py-2.5 rounded-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
              >
                <Camera className="w-4 h-4 stroke-[2.5]" />
                <span>Upload Prescription (Rx)</span>
              </button>

              <Link
                href="/upload-prescription"
                className="block text-center text-[11px] font-bold text-teal-100 hover:text-white underline underline-offset-2"
              >
                How Truemeds prescription matching works →
              </Link>
            </div>

            <div className="border-t border-white/20 pt-2 flex items-center justify-between text-[10px] text-teal-100">
              <span>✓ WhatsApp Order Link</span>
              <span>✓ NABL Certified</span>
              <span>✓ Free Delivery</span>
            </div>
          </div>
        </div>

        {/* 3. TRUEMEDS CORE USP: SMART SUBSTITUTE / ALTERNATIVE SAVINGS ENGINE */}
        <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-teal-50/50 via-white to-amber-50/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#128983] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-2xs">
                  TRUEMEDS SMART SUBSTITUTE ENGINE
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" /> Save Up To 51% on Every Chronic Need
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Switch from Expensive Chemical Drugs to Classical Ayurvedic Formulations
              </h3>
              <p className="text-xs text-slate-500">
                Same active bio-compounds, zero heavy metals, and up to 51% lower monthly medical expenditure.
              </p>
            </div>

            <Link
              href="/categories"
              className="text-xs font-bold text-[#128983] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Explore All Classical Substitutes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Condition Tabs */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200 overflow-x-auto scrollbar-none text-xs">
            {substituteComparisons.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveSubstituteTab(idx)}
                className={`px-3 py-1.5 rounded-sm font-bold whitespace-nowrap transition-colors ${
                  activeSubstituteTab === idx
                    ? 'bg-[#128983] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {item.condition}
              </button>
            ))}
          </div>

          {/* Side-by-Side Savings Comparison Card */}
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Expensive Commercial Brand */}
            <div className="md:col-span-5 bg-red-50/40 border border-red-200 rounded-md p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-red-700 bg-red-100 uppercase px-2 py-0.5 rounded-2xs">
                  COMMERCIAL CHEMICAL BRAND
                </span>
                <span className="text-xs font-bold text-slate-500">Regular Market MRP</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 line-clamp-2">
                  {selectedSub.allopathicBrand}
                </h4>
                <div className="text-2xl font-black text-slate-800 pt-1">
                  ₹{selectedSub.allopathicPrice}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-1 border-t border-red-100">
                Synthetic binders, chemical fillers, and recurring monthly expense.
              </div>
            </div>

            {/* Center: Savings Metric Pill */}
            <div className="md:col-span-2 text-center flex flex-col items-center justify-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs flex flex-col items-center justify-center shadow-xs border border-emerald-300">
                <span>{selectedSub.savingsPercent}%</span>
                <span className="text-[8px] uppercase">SAVE</span>
              </div>
              <div className="text-xs font-black text-emerald-800">
                Save ₹{selectedSub.savingsAmount}
              </div>
              <span className="text-[9px] text-slate-400 font-semibold uppercase">Every Month</span>
            </div>

            {/* Right: Recommended Classical Substitute */}
            <div className="md:col-span-5 bg-emerald-50/40 border-2 border-emerald-500 rounded-md p-4 space-y-3 relative shadow-xs">
              <span className="absolute -top-3 right-4 bg-emerald-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                TRUEMEDS RECOMMENDED ALTERNATIVE
              </span>

              <div className="flex items-center gap-3">
                <img
                  src={selectedSub.image}
                  alt={selectedSub.classicalRemedy}
                  className="w-16 h-16 object-cover rounded-sm border border-emerald-200 bg-white"
                />
                <div className="space-y-0.5 flex-1">
                  <h4 className="text-sm font-black text-slate-900 leading-tight">
                    {selectedSub.classicalRemedy}
                  </h4>
                  <div className="text-[10px] text-emerald-700 font-bold">
                    ✓ Matches {selectedSub.biomoleculeMatch}
                  </div>
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-xl font-black text-[#128983]">
                      ₹{selectedSub.classicalPrice}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{selectedSub.allopathicPrice}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-200 flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> NABL Certified Shodhita
                </span>

                <button
                  onClick={() =>
                    addItem({
                      id: selectedSub.id,
                      productId: selectedSub.id,
                      variantId: selectedSub.id,
                      sku: selectedSub.id,
                      title: selectedSub.classicalRemedy,
                      price: selectedSub.classicalPrice,
                      image: selectedSub.image,
                      quantity: 1,
                    })
                  }
                  className="bg-[#128983] hover:bg-[#0d6e68] text-white font-black text-xs px-4 py-2 rounded-sm shadow-sm transition-colors uppercase tracking-wider flex items-center gap-1"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Switch & Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. TRUEMEDS REFERENCE: CHRONIC CARE & HEALTH CONDITIONS NAVIGATION */}
        <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#ffe500] text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-2xs">
                  CHRONIC CARE APOTHECARY
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Find remedies tailored to your health condition
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Shop by Health Condition & Chronic Care
              </h3>
            </div>

            <Link
              href="/categories"
              className="text-xs font-bold text-[#128983] hover:underline"
            >
              All Conditions →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {chronicHealthConditions.map((cond) => (
              <Link
                key={cond.title}
                href={`/categories/${cond.slug}`}
                className="group p-3 rounded-sm border border-slate-200 hover:border-[#128983] bg-white hover:shadow-md transition-all flex flex-col justify-between text-center space-y-2"
              >
                <div className="space-y-1">
                  <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-teal-50 text-2xl flex items-center justify-center mx-auto transition-colors border border-slate-100">
                    {cond.icon}
                  </div>
                  <div className="text-xs font-black text-slate-900 group-hover:text-[#128983] leading-snug">
                    {cond.title}
                  </div>
                  <div className="text-[10px] text-slate-400 font-serif line-clamp-1">
                    {cond.hindi}
                  </div>
                </div>

                <div className="bg-emerald-50 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded-2xs">
                  {cond.savings}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 5. Live Catalog Products Rail */}
        <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Verified Classical Formulations</h3>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-sm">
                <Clock className="w-3.5 h-3.5 text-[#128983]" />
                <span className="font-mono text-slate-700 font-bold">19h : 42m : 18s Left</span>
              </div>
            </div>
            <Link
              href="/categories"
              className="bg-[#128983] hover:bg-[#0d6e68] text-white text-xs font-bold px-4 py-2 rounded-sm shadow-sm uppercase tracking-wider transition-colors"
            >
              View All ({products.length} Products)
            </Link>
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {products.slice(0, 12).map((product) => (
              <div
                key={product.id}
                className="group relative bg-white border border-slate-100 hover:border-slate-300 rounded-sm p-3 flex flex-col justify-between hover:shadow-md transition-all"
              >
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

                <div className="space-y-1.5">
                  <Link
                    href={`/products/${product.slug}`}
                    className="block text-xs font-bold text-slate-800 hover:text-[#128983] line-clamp-2 leading-tight h-8"
                    title={product.title}
                  >
                    {product.title}
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-xs flex items-center gap-0.5">
                      <span>{product.rating}</span>
                      <Star className="w-2.5 h-2.5 fill-white" />
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ({product.reviews.toLocaleString('en-IN')})
                    </span>

                    <span className="ml-auto flex items-center bg-[#128983] text-white text-[9px] font-black italic px-1 rounded-2xs tracking-tighter" title="100% Genuine Lab-Tested Herbal Guarantee">
                      Veda<span className="text-[#ffe500]">✓</span>
                    </span>
                  </div>

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

                  <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    <Truck className="w-3 h-3 text-[#128983]" />
                    <span>Free Delivery</span>
                  </div>
                </div>

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
                    title="Generate Share Link"
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

        {/* 6. TRUEMEDS TRIPLE-CHECK QUALITY GUARANTEE BAR */}
        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-[#128983] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h5 className="font-bold text-xs text-slate-900">1. Triple-Check Pharmacist Audit</h5>
            <p className="text-[11px] text-slate-500">Every prescription verified by registered licensed Vaidyas & pharmacists</p>
          </div>

          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h5 className="font-bold text-xs text-slate-900">2. 100% NABL Heavy Metal Tested</h5>
            <p className="text-[11px] text-slate-500">Certified zero lead, mercury, or harmful chemical adulterants in all batches</p>
          </div>

          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <Percent className="w-6 h-6" />
            </div>
            <h5 className="font-bold text-xs text-slate-900">3. Save Up to 51% Always</h5>
            <p className="text-[11px] text-slate-500">Direct classical shodhita formulations cutting out pharmaceutical middlemen</p>
          </div>

          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h5 className="font-bold text-xs text-slate-900">4. Pan-India Ekart Delivery</h5>
            <p className="text-[11px] text-slate-500">Fast delivery across 19,000+ PIN codes with tamper-evident packaging</p>
          </div>
        </div>
      </main>

      {/* 7. Footer */}
      <footer className="bg-[#172337] text-white text-xs mt-8">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-5 gap-8 border-b border-slate-700/80">
          <div className="space-y-2">
            <h6 className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">ABOUT VEDAFLOW</h6>
            <ul className="space-y-1.5 text-slate-300">
              <li><Link href="/" className="hover:underline">Contact Us</Link></li>
              <li><Link href="/upload-prescription" className="hover:underline">Upload Prescription</Link></li>
              <li><Link href="/" className="hover:underline">Truemeds Savings Guide</Link></li>
              <li><Link href="/" className="hover:underline">NABL Lab Certification</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h6 className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">CHRONIC CARE</h6>
            <ul className="space-y-1.5 text-slate-300">
              <li><Link href="/categories" className="hover:underline">Diabetes Care</Link></li>
              <li><Link href="/categories" className="hover:underline">Cardiac Health</Link></li>
              <li><Link href="/categories" className="hover:underline">Joint & Arthritis</Link></li>
              <li><Link href="/categories" className="hover:underline">Digestive & Gut</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h6 className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">CONSUMER POLICY</h6>
            <ul className="space-y-1.5 text-slate-300">
              <li><Link href="/" className="hover:underline">Return Policy</Link></li>
              <li><Link href="/" className="hover:underline">Terms Of Use</Link></li>
              <li><Link href="/" className="hover:underline">Security (PCI-DSS)</Link></li>
              <li><Link href="/" className="hover:underline">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h6 className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">PAYMENTS & DELIVERY</h6>
            <ul className="space-y-1.5 text-slate-300">
              <li><Link href="/" className="hover:underline">Razorpay UPI & Cards</Link></li>
              <li><Link href="/" className="hover:underline">Cash on Delivery (COD)</Link></li>
              <li><Link href="/" className="hover:underline">Ekart EV Dispatch</Link></li>
              <li><Link href="/" className="hover:underline">Track Your Order</Link></li>
            </ul>
          </div>

          <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-700/80 md:pl-6 text-slate-300">
            <h6 className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">REGISTERED OFFICE</h6>
            <p className="leading-relaxed text-[11px]">
              VedaFlow E-Commerce Private Limited,<br />
              Embassy Tech Village, Outer Ring Road,<br />
              Bengaluru, 560103, Karnataka, India<br />
              CIN: U51109KA2026PTC066107
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>© 2026 VedaFlow.com · Truemeds-Inspired Smart Medicine Savings</div>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px]">
            <CreditCard className="w-4 h-4 text-slate-400" />
            <span>Razorpay · Visa · MasterCard · RuPay · NetBanking · UPI · COD</span>
          </div>
        </div>
      </footer>

      {/* Prescription Upload Modal */}
      <UploadPrescriptionModal
        isOpen={isRxModalOpen}
        onClose={() => setIsRxModalOpen(false)}
      />
    </div>
  );
}
