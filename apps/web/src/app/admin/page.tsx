'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  Truck,
  ShieldCheck,
  Share2,
  FileText,
  Search,
  Filter,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ExternalLink,
  Copy,
  Check,
  Leaf,
  Award,
  Package,
  Layers,
  ChevronRight,
  Printer,
  Download,
  Star,
  Menu,
  X,
  PhoneCall,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Sparkles,
  Image as ImageIcon,
  IndianRupee,
  ToggleLeft,
  ToggleRight,
  Percent,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileCheck,
  Send,
  Zap,
  Activity,
  ArrowRight,
  Calendar,
  SlidersHorizontal,
  Compass,
  Command,
  Bell,
  Heart,
} from 'lucide-react';

interface AdminProduct {
  id: string;
  title: string;
  hindiName?: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
  price: number;
  compareAtPrice: number;
  discountPct: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  stockCount: number;
  image: string;
  classicalReference?: string;
  badges: string[];
  keyBenefits?: string[];
  nablCertified?: boolean;
  description?: string;
}

interface AdminBanner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  ctaText: string;
  ctaLink: string;
  bgGradient: string;
  imageUrl?: string;
  active: boolean;
}

interface AdminOrder {
  id: string;
  customer: string;
  phone: string;
  amount: number;
  status: 'PAID' | 'PACKED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  itemsCount: number;
  itemsSummary: string;
  date: string;
  courier: string;
  pin: string;
  paymentMethod: 'RAZORPAY_UPI' | 'RAZORPAY_CARD' | 'COD';
}

interface AdminPrescription {
  id: string;
  patientName: string;
  phone: string;
  pin: string;
  uploadedAt: string;
  imageUrl: string;
  status: 'PENDING_REVIEW' | 'SUBSTITUTE_RECOMMENDED' | 'APPROVED' | 'REJECTED';
  preference: 'substitute' | 'exact';
  prescribedDrug: string;
  recommendedHerbal: string;
  savingsEstimated: number;
}

interface AdminCoupon {
  code: string;
  discountPct: number;
  minOrder: number;
  active: boolean;
  usedCount: number;
  description: string;
}

const CATALOG_KEY = 'vedaflow_catalog_v2';
const BANNERS_KEY = 'vedaflow_banners_v2';

const initialDefaultProducts: AdminProduct[] = [
  {
    id: 'shilajit-resin-gold',
    title: 'Pure Himalayan Shilajit Resin with 24K Swarna Vark (20g)',
    hindiName: 'शुद्ध हिमालयन शिलाजीत स्वर्ण युक्त',
    slug: 'pure-himalayan-shilajit-resin-20g',
    categoryName: 'Pure Shilajit',
    categorySlug: 'pure-shilajit',
    price: 1499,
    compareAtPrice: 2499,
    discountPct: 40,
    rating: 4.9,
    reviews: 842,
    inStock: true,
    stockCount: 45,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
    classicalReference: 'Charaka Samhita Chikitsa Sthana 1.3',
    badges: ['AYUSH Premium', 'NABL Lab Certified', 'Zero Heavy Metals'],
    keyBenefits: ['Fulvic Acid > 75%', 'Boosts Ojas & Stamina', 'Cellular Rejuvenation'],
    nablCertified: true,
    description: 'Purified via traditional 7-step Agnitapi Shodhana using Triphala decoction. Sourced from high-altitude Himalayan cliffs above 18,000 ft.',
  },
  {
    id: 'swarna-chyawanprash-1kg',
    title: 'Swarna Bhasma Amrit Chyawanprash (1kg Brass Pot)',
    hindiName: 'स्वर्ण भस्म अमृत च्यवनप्राश',
    slug: 'swarna-bhasma-chyawanprash-1kg',
    categoryName: 'Classical Rasayanas',
    categorySlug: 'classical-rasayanas',
    price: 1899,
    compareAtPrice: 2999,
    discountPct: 37,
    rating: 4.8,
    reviews: 1240,
    inStock: true,
    stockCount: 62,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
    classicalReference: 'Charaka Samhita Rasayana Adhyaya 1.1',
    badges: ['24K Gold Bhasma', 'A2 Desi Gir Cow Ghee', 'Raw Forest Honey'],
    keyBenefits: ['Builds Prana & Bala', 'Seasonal Immunity Shield', 'Nourishes All 7 Dhatus'],
    nablCertified: true,
    description: 'Cooked in heavy copper cauldrons with 52 handpicked forest botanicals, wild organic amla, and A2 Gir cow bilona ghee.',
  },
  {
    id: 'kumkumadi-tailam-30ml',
    title: 'Kashmiri Saffron Kumkumadi Miraculous Night Beauty Fluid (30ml)',
    hindiName: 'कुंकुमादि तैलम् कश्मीरी केसर युक्त',
    slug: 'kashmiri-saffron-kumkumadi-oil-30ml',
    categoryName: 'Medicated Thailams & Hair Oils',
    categorySlug: 'herbal-oils',
    price: 999,
    compareAtPrice: 1699,
    discountPct: 41,
    rating: 4.9,
    reviews: 620,
    inStock: true,
    stockCount: 28,
    image: 'https://images.unsplash.com/photo-1608248597359-597597143922?w=600&auto=format&fit=crop&q=80',
    classicalReference: 'Ashtanga Hridaya Kshudra Roga Chikitsa',
    badges: ['Kashmiri Mongra Saffron', 'Cold-Pressed Sesame', 'Zero Artificial Fragrance'],
    keyBenefits: ['Luminous Golden Radiance', 'Reduces Blemishes', 'Natural Anti-Pigmentation'],
    nablCertified: true,
    description: 'Formulated with authentic Grade-A Pampore saffron stigmas, red sandalwood, and goat milk decoction.',
  },
  {
    id: 'ksm66-ashwagandha-60caps',
    title: 'KSM-66 Full-Spectrum Organic Ashwagandha Root Extract (60 Veg Caps)',
    hindiName: 'केएसएम-६६ अश्वगंधा मूल अर्क',
    slug: 'ksm66-organic-ashwagandha-root-extract',
    categoryName: 'Classical Rasayanas',
    categorySlug: 'classical-rasayanas',
    price: 699,
    compareAtPrice: 1199,
    discountPct: 42,
    rating: 4.8,
    reviews: 950,
    inStock: true,
    stockCount: 85,
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&auto=format&fit=crop&q=80',
    classicalReference: 'Bhavaprakasha Nighantu Haritakyadi Varga',
    badges: ['5% Withanolides', 'Organic Certified', 'Water-Extracted Only'],
    keyBenefits: ['Lowers Serum Cortisol', 'Deep Restorative Sleep', 'Enhances Muscle Recovery'],
    nablCertified: true,
    description: 'Gold-standard KSM-66 extract created using 14 years of research into green-extraction technology without alcohols or harsh solvents.',
  },
  {
    id: 'triphala-churna-250g',
    title: 'Organic Triphala Churna Digestive & Detox Blend (250g)',
    hindiName: 'त्रिफला चूर्ण जैविक शुद्ध',
    slug: 'triphala-churna-organic-250g',
    categoryName: 'Churnas & Single Herbs',
    categorySlug: 'churnas-single-herbs',
    price: 349,
    compareAtPrice: 499,
    discountPct: 30,
    rating: 4.7,
    reviews: 430,
    inStock: true,
    stockCount: 110,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    classicalReference: 'Charaka Samhita Sutrasthana Ch. 4',
    badges: ['Equal 1:1:1 Ratio', 'Sun-Dried Forest Fruits', 'AYUSH GMP Certified'],
    keyBenefits: ['Gentle Bowel Regularity', 'Deep Gut Detox', 'Eye Health & Digestion'],
    nablCertified: true,
    description: 'Balanced blend of organic Haritaki, Bibhitaki, and Amalaki sourced from pristine central Indian deciduous forests.',
  },
  {
    id: 'bringadi-hair-taila-200ml',
    title: 'Classical Bringadi Intensive Hair Fall Treatment Oil (200ml)',
    hindiName: 'भृंगादि तैलम् केशवर्धक',
    slug: 'classical-bringadi-intensive-hair-oil-200ml',
    categoryName: 'Medicated Thailams & Hair Oils',
    categorySlug: 'herbal-oils',
    price: 799,
    compareAtPrice: 1299,
    discountPct: 38,
    rating: 4.9,
    reviews: 780,
    inStock: true,
    stockCount: 34,
    image: 'https://images.unsplash.com/photo-1608248597359-597597143922?w=600&auto=format&fit=crop&q=80',
    classicalReference: 'Sahasrayogam Taila Prakarana',
    badges: ['Pure False Daisy (Bhringraj)', 'Coconut Milk Base', 'Slow Copper Heated'],
    keyBenefits: ['Arrests Hair Thinning', 'Prevents Premature Greying', 'Cooling Scalp Relief'],
    nablCertified: true,
    description: '21-day slow infusion of fresh Bhringraj leaves, Amla, Indigo, and Balloon Vine cooked in pure unrefined sesame and virgin coconut milk.',
  },
];

const initialDefaultBanners: AdminBanner[] = [
  {
    id: 'b-immunity-fest',
    title: 'Ayurvedic Immunity Mahotsav - Up to 55% Off',
    subtitle: 'NABL Certified Swarna Bhasma Chyawanprash, Shilajit & KSM-66 Ashwagandha',
    tag: 'FLIPKART AYUSH EXCLUSIVE',
    ctaText: 'Shop Classical Rasayanas',
    ctaLink: '/categories/classical-rasayanas',
    bgGradient: 'from-[#0d9488] via-[#0f766e] to-[#115e59]',
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    active: true,
  },
  {
    id: 'b-shilajit-gold',
    title: 'Pure Himalayan Shilajit Resin with 24K Gold',
    subtitle: 'Harvested at 18,000 ft · Shodhita with Triphala · 75%+ Fulvic Acid',
    tag: 'BESTSELLER HERBAL REMEDY',
    ctaText: 'Discover Pure Shilajit',
    ctaLink: '/categories/pure-shilajit',
    bgGradient: 'from-[#065f46] via-[#047857] to-[#059669]',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
    active: true,
  },
  {
    id: 'b-kumkumadi-glow',
    title: 'Kashmiri Saffron Kumkumadi Miracle Beauty Fluid',
    subtitle: 'Hand-harvested Pampore Grade-A Saffron · Ancient Radiance Elixir',
    tag: 'VEDIC BEAUTY APOTHECARY',
    ctaText: 'Explore Medicated Oils',
    ctaLink: '/categories/herbal-oils',
    bgGradient: 'from-[#b45309] via-[#d97706] to-[#f59e0b]',
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-597597143922?w=800&auto=format&fit=crop&q=80',
    active: true,
  },
];

const initialDefaultOrders: AdminOrder[] = [
  {
    id: 'OD-VEDA-8421098',
    customer: 'Priya Sharma',
    phone: '+91 98765 43210',
    amount: 1499,
    status: 'OUT_FOR_DELIVERY',
    itemsCount: 1,
    itemsSummary: 'Pure Himalayan Shilajit Resin (20g)',
    date: '12 Mins ago',
    courier: 'Ekart / Ramesh (EV Scooter)',
    pin: '560001',
    paymentMethod: 'RAZORPAY_UPI',
  },
  {
    id: 'OD-VEDA-7319401',
    customer: 'Dr. Anand Joshi',
    phone: '+91 98765 43211',
    amount: 2598,
    status: 'PAID',
    itemsCount: 3,
    itemsSummary: 'Swarna Chyawanprash (1kg) + KSM-66 Ashwagandha',
    date: '28 Mins ago',
    courier: 'Ekart Logistics Central Hub',
    pin: '400001',
    paymentMethod: 'RAZORPAY_CARD',
  },
  {
    id: 'OD-VEDA-6104882',
    customer: 'Sneha Patel',
    phone: '+91 98765 43212',
    amount: 3797,
    status: 'PACKED',
    itemsCount: 2,
    itemsSummary: 'Kashmiri Kumkumadi Oil (30ml) + Triphala Churna',
    date: '1 Hour ago',
    courier: 'Ekart Express Dispatch',
    pin: '380015',
    paymentMethod: 'RAZORPAY_UPI',
  },
  {
    id: 'OD-VEDA-5822190',
    customer: 'Meera Nambiar',
    phone: '+91 98765 43213',
    amount: 1299,
    status: 'DELIVERED',
    itemsCount: 1,
    itemsSummary: 'Classical Bringadi Intensive Hair Oil (200ml)',
    date: '3 Hours ago',
    courier: 'Ekart / Ramesh (EV Scooter)',
    pin: '682001',
    paymentMethod: 'COD',
  },
];

const initialDefaultPrescriptions: AdminPrescription[] = [
  {
    id: 'RX-VEDA-901842',
    patientName: 'Rajesh Malhotra',
    phone: '+91 98112 34567',
    pin: '110001',
    uploadedAt: '15 Mins ago',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
    status: 'PENDING_REVIEW',
    preference: 'substitute',
    prescribedDrug: 'Synthetic Glimepiride + Metformin 500mg',
    recommendedHerbal: 'Gurmar & Jamun Seed Classical Churna + Shilajit',
    savingsEstimated: 51,
  },
  {
    id: 'RX-VEDA-841920',
    patientName: 'Ananya Deshmukh',
    phone: '+91 97234 56789',
    pin: '411001',
    uploadedAt: '45 Mins ago',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
    status: 'SUBSTITUTE_RECOMMENDED',
    preference: 'substitute',
    prescribedDrug: 'Commercial Multivitamin & Pain Relief Gel',
    recommendedHerbal: 'Swarna Chyawanprash + Mahanarayan Thailam',
    savingsEstimated: 50,
  },
  {
    id: 'RX-VEDA-732019',
    patientName: 'Vikramaditya Sengupta',
    phone: '+91 99001 23456',
    pin: '700001',
    uploadedAt: '2 Hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
    status: 'APPROVED',
    preference: 'exact',
    prescribedDrug: 'Classical Ksheerabala 101 Tailam (Exact Brand)',
    recommendedHerbal: 'Ksheerabala 101 Tailam (Direct Pharmacopoeia Batch)',
    savingsEstimated: 35,
  },
];

const initialDefaultCoupons: AdminCoupon[] = [
  { code: 'FIRST25', discountPct: 25, minOrder: 499, active: true, usedCount: 1420, description: 'Flat 25% Off on First Medicine Order' },
  { code: 'WELCOME500', discountPct: 20, minOrder: 999, active: true, usedCount: 890, description: 'Save ₹500 on Classical Rasayanas above ₹999' },
  { code: 'HERBAL20', discountPct: 20, minOrder: 599, active: true, usedCount: 610, description: '20% Off on Shodhita Resins & Herbal Churnas' },
  { code: 'AYUSH50', discountPct: 50, minOrder: 1999, active: false, usedCount: 340, description: 'Festival Clearance BOGO Classical Offer' },
];

const imagePresets = [
  { label: 'Gold Shilajit', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80' },
  { label: 'Chyawanprash', url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80' },
  { label: 'Ashwagandha', url: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&auto=format&fit=crop&q=80' },
  { label: 'Kumkumadi Oil', url: 'https://images.unsplash.com/photo-1608248597359-597597143922?w=600&auto=format&fit=crop&q=80' },
  { label: 'Triphala / Herbs', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80' },
  { label: 'Herbal Tea / Kwath', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80' },
];

const gradientPresets = [
  { label: 'Emerald Mint (Botanical)', value: 'from-[#059669] via-[#0d9488] to-[#14b8a6]' },
  { label: 'Obsidian Cyan (Linear Style)', value: 'from-[#0f172a] via-[#1e293b] to-[#0891b2]' },
  { label: 'Saffron Gold (Veda Aura)', value: 'from-[#b45309] via-[#d97706] to-[#f59e0b]' },
  { label: 'Crimson Shodhita (Classical)', value: 'from-[#881337] via-[#9f1239] to-[#be123c]' },
  { label: 'Midnight Indigo (Tech)', value: 'from-[#1e1b4b] via-[#312e81] to-[#4338ca]' },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    'products' | 'prescriptions' | 'banners' | 'orders' | 'inventory' | 'coupons' | 'delivery' | 'share' | 'analytics' | 'audit'
  >('products');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Products State
  const [products, setProducts] = useState<AdminProduct[]>(initialDefaultProducts);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Product Form
  const [productForm, setProductForm] = useState({
    title: '',
    hindiName: '',
    slug: '',
    categoryName: 'Classical Rasayanas',
    categorySlug: 'classical-rasayanas',
    price: 999,
    compareAtPrice: 1499,
    inStock: true,
    stockCount: 50,
    image: imagePresets[0].url,
    classicalReference: 'Charaka Samhita Chikitsa Sthana',
    badgesText: 'AYUSH Certified, NABL Tested, 100% Herbal',
    keyBenefitsText: 'Immunity, Vitality, Digestion',
    nablCertified: true,
    description: 'Handcrafted classical Ayurvedic medicine formulated strictly per ancient authentic Ayurvedic Pharmacopoeia of India standards.',
  });

  // Banners State
  const [banners, setBanners] = useState<AdminBanner[]>(initialDefaultBanners);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    tag: 'FESTIVAL SPECIAL',
    ctaText: 'Shop Now',
    ctaLink: '/categories/classical-rasayanas',
    bgGradient: gradientPresets[0].value,
    imageUrl: imagePresets[0].url,
    active: true,
  });

  // Orders State
  const [orders, setOrders] = useState<AdminOrder[]>(initialDefaultOrders);
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [printingOrder, setPrintingOrder] = useState<AdminOrder | null>(null);

  // Prescriptions State (Truemeds Pharmacist Audit)
  const [prescriptions, setPrescriptions] = useState<AdminPrescription[]>(initialDefaultPrescriptions);
  const [viewingRx, setViewingRx] = useState<AdminPrescription | null>(null);

  // Coupons State
  const [coupons, setCoupons] = useState<AdminCoupon[]>(initialDefaultCoupons);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountPct: 20,
    minOrder: 499,
    description: '',
  });

  // Marketing Share Generator State
  const [shareProduct, setShareProduct] = useState('swarna-bhasma-chyawanprash-1kg');
  const [copiedCaption, setCopiedCaption] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedProducts = localStorage.getItem(CATALOG_KEY);
        if (storedProducts) {
          const parsed = JSON.parse(storedProducts);
          if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
        }
        const storedBanners = localStorage.getItem(BANNERS_KEY);
        if (storedBanners) {
          const parsed = JSON.parse(storedBanners);
          if (Array.isArray(parsed) && parsed.length > 0) setBanners(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to parse storage', e);
    }
  }, []);

  const persistProducts = (updated: AdminProduct[]) => {
    setProducts(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CATALOG_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('vedaflow_catalog_change'));
        fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated[0]),
        }).catch(() => {});
      } catch (err) {
        console.error('Failed saving products', err);
      }
    }
  };

  const persistBanners = (updated: AdminBanner[]) => {
    setBanners(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(BANNERS_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('vedaflow_banners_change'));
        fetch('/api/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated[0]),
        }).catch(() => {});
      } catch (err) {
        console.error('Failed saving banners', err);
      }
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      title: '',
      hindiName: '',
      slug: '',
      categoryName: 'Classical Rasayanas',
      categorySlug: 'classical-rasayanas',
      price: 999,
      compareAtPrice: 1499,
      inStock: true,
      stockCount: 50,
      image: imagePresets[0].url,
      classicalReference: 'Charaka Samhita Chikitsa Sthana',
      badgesText: 'AYUSH Certified, NABL Tested, 100% Herbal',
      keyBenefitsText: 'Immunity, Vitality, Digestion',
      nablCertified: true,
      description: 'Handcrafted classical Ayurvedic medicine formulated strictly per ancient authentic Ayurvedic Pharmacopoeia of India standards.',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: AdminProduct) => {
    setEditingProductId(prod.id);
    setProductForm({
      title: prod.title,
      hindiName: prod.hindiName || '',
      slug: prod.slug,
      categoryName: prod.categoryName,
      categorySlug: prod.categorySlug,
      price: prod.price,
      compareAtPrice: prod.compareAtPrice,
      inStock: prod.inStock,
      stockCount: prod.stockCount || 50,
      image: prod.image,
      classicalReference: prod.classicalReference || '',
      badgesText: prod.badges?.join(', ') || '',
      keyBenefitsText: prod.keyBenefits?.join(', ') || '',
      nablCertified: prod.nablCertified ?? true,
      description: prod.description || '',
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title.trim()) return;

    const discount =
      productForm.compareAtPrice > productForm.price
        ? Math.round(((productForm.compareAtPrice - productForm.price) / productForm.compareAtPrice) * 100)
        : 0;

    const generatedSlug =
      productForm.slug.trim() ||
      productForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const badges = productForm.badgesText.split(',').map((b) => b.trim()).filter(Boolean);
    const keyBenefits = productForm.keyBenefitsText.split(',').map((b) => b.trim()).filter(Boolean);

    if (editingProductId) {
      const updated = products.map((p) => {
        if (p.id === editingProductId) {
          return {
            ...p,
            title: productForm.title,
            hindiName: productForm.hindiName,
            slug: generatedSlug,
            categoryName: productForm.categoryName,
            categorySlug: productForm.categorySlug,
            price: Number(productForm.price),
            compareAtPrice: Number(productForm.compareAtPrice),
            discountPct: discount,
            inStock: productForm.inStock,
            stockCount: Number(productForm.stockCount),
            image: productForm.image,
            classicalReference: productForm.classicalReference,
            badges,
            keyBenefits,
            nablCertified: productForm.nablCertified,
            description: productForm.description,
          };
        }
        return p;
      });
      persistProducts(updated);
      showToast('Formulation updated successfully');
    } else {
      const newProd: AdminProduct = {
        id: `prod-${Date.now()}`,
        title: productForm.title,
        hindiName: productForm.hindiName,
        slug: generatedSlug,
        categoryName: productForm.categoryName,
        categorySlug: productForm.categorySlug,
        price: Number(productForm.price),
        compareAtPrice: Number(productForm.compareAtPrice),
        discountPct: discount,
        rating: 4.9,
        reviews: 1,
        inStock: productForm.inStock,
        stockCount: Number(productForm.stockCount),
        image: productForm.image,
        classicalReference: productForm.classicalReference,
        badges,
        keyBenefits,
        nablCertified: productForm.nablCertified,
        description: productForm.description,
      };
      persistProducts([newProd, ...products]);
      showToast('Published new medicine to live storefront');
    }
    setIsProductModalOpen(false);
  };

  const handleToggleStock = (id: string) => {
    const updated = products.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p));
    persistProducts(updated);
    showToast('Stock status toggled');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Delete this product from catalog?')) {
      const updated = products.filter((p) => p.id !== id);
      persistProducts(updated);
      showToast('Product removed');
    }
  };

  const handleOpenAddBanner = () => {
    setEditingBannerId(null);
    setBannerForm({
      title: '',
      subtitle: '',
      tag: 'TRUEMEDS SPECIAL',
      ctaText: 'Shop Now',
      ctaLink: '/categories/classical-rasayanas',
      bgGradient: gradientPresets[0].value,
      imageUrl: imagePresets[0].url,
      active: true,
    });
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (b: AdminBanner) => {
    setEditingBannerId(b.id);
    setBannerForm({
      title: b.title,
      subtitle: b.subtitle,
      tag: b.tag,
      ctaText: b.ctaText,
      ctaLink: b.ctaLink,
      bgGradient: b.bgGradient,
      imageUrl: b.imageUrl || imagePresets[0].url,
      active: b.active,
    });
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.title.trim()) return;

    if (editingBannerId) {
      const updated = banners.map((b) => (b.id === editingBannerId ? { ...b, ...bannerForm } : b));
      persistBanners(updated);
      showToast('Hero banner updated');
    } else {
      const newBanner: AdminBanner = { id: `banner-${Date.now()}`, ...bannerForm };
      persistBanners([newBanner, ...banners]);
      showToast('Hero banner published');
    }
    setIsBannerModalOpen(false);
  };

  const handleToggleBanner = (id: string) => {
    const updated = banners.map((b) => (b.id === id ? { ...b, active: !b.active } : b));
    persistBanners(updated);
    showToast('Banner visibility toggled');
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm('Delete banner?')) {
      const updated = banners.filter((b) => b.id !== id);
      persistBanners(updated);
      showToast('Banner deleted');
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: AdminOrder['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    showToast(`Order status updated to ${newStatus}`);
  };

  const handleUpdateRxStatus = (
    rxId: string,
    newStatus: AdminPrescription['status'],
    recommendedRemedy?: string
  ) => {
    setPrescriptions((prev) =>
      prev.map((rx) => {
        if (rx.id === rxId) {
          return {
            ...rx,
            status: newStatus,
            recommendedHerbal: recommendedRemedy || rx.recommendedHerbal,
          };
        }
        return rx;
      })
    );
    setViewingRx(null);
    showToast(`Prescription ${rxId} updated to ${newStatus}`);
  };

  const handleToggleCoupon = (code: string) => {
    setCoupons((prev) => prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c)));
    showToast(`Coupon ${code} status changed`);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code.trim()) return;
    const newCoupon: AdminCoupon = {
      code: couponForm.code.toUpperCase().trim(),
      discountPct: Number(couponForm.discountPct),
      minOrder: Number(couponForm.minOrder),
      active: true,
      usedCount: 0,
      description: couponForm.description,
    };
    setCoupons([newCoupon, ...coupons]);
    setIsCouponModalOpen(false);
    showToast(`Coupon ${newCoupon.code} created`);
  };

  const handleAdjustStock = (sku: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === sku) {
          const nextStock = Math.max(0, p.stockCount + delta);
          return { ...p, stockCount: nextStock, inStock: nextStock > 0 };
        }
        return p;
      })
    );
    showToast(`Adjusted inventory for ${sku}`);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.hindiName && p.hindiName.includes(productSearch));
      const matchesCategory =
        productCategoryFilter === 'all' || p.categorySlug === productCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, productSearch, productCategoryFilter]);

  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === 'ALL') return orders;
    return orders.filter((o) => o.status === orderStatusFilter);
  }, [orders, orderStatusFilter]);

  const navItems = [
    { id: 'products' as const, label: 'Catalog & Formulations', shortLabel: 'Products', icon: Package, badge: `${products.length}` },
    { id: 'prescriptions' as const, label: 'Prescription Queue', shortLabel: 'Rx Queue', icon: FileCheck, badge: `${prescriptions.filter((r) => r.status === 'PENDING_REVIEW').length} New` },
    { id: 'orders' as const, label: 'Order Dispatch Pipeline', shortLabel: 'Orders', icon: ShoppingBag, badge: `${orders.length}` },
    { id: 'banners' as const, label: 'Hero Promotions', shortLabel: 'Banners', icon: Sparkles },
    { id: 'inventory' as const, label: 'Botanical Inventory', shortLabel: 'Stock', icon: Layers },
    { id: 'coupons' as const, label: 'Coupons & Vouchers', shortLabel: 'Coupons', icon: Percent },
    { id: 'delivery' as const, label: 'Ekart EV Fleet', shortLabel: 'Fleet', icon: Truck },
    { id: 'share' as const, label: 'Ad Copy Studio', shortLabel: 'Studio', icon: Share2 },
    { id: 'analytics' as const, label: 'Revenue Analytics', shortLabel: 'Analytics', icon: TrendingUp },
    { id: 'audit' as const, label: 'AYUSH Compliance', shortLabel: 'Audit', icon: ShieldCheck },
  ];

  return (
    <div className="flex h-screen bg-[#090D16] text-slate-100 font-sans overflow-hidden antialiased selection:bg-teal-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900/95 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-teal-500/30 flex items-center gap-2.5 backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* 1. SIDEBAR: Deep Luxury Obsidian & Emerald Aura */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0B101E] text-slate-300 flex flex-col justify-between p-3.5 shrink-0 border-r border-slate-800/80 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* Brand Header */}
          <div className="p-3 bg-gradient-to-br from-slate-900 to-[#0e172a] rounded-xl border border-slate-800/80 flex items-center justify-between shadow-inner">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-teal-500/20">
                  <Leaf className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-base font-black tracking-tight text-white">
                  Veda<span className="text-teal-400">Flow</span>
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
                  PRO
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium pl-9">
                Pharmacist Control Center
              </div>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick System Badge */}
          <div className="px-3 py-1.5 bg-slate-900/60 rounded-lg border border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Production Live</span>
            </span>
            <span className="text-[10px] font-mono text-teal-400 font-bold">veda.prigenix.com</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-1 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left group ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/10 text-teal-300 border border-teal-500/30 shadow-sm shadow-teal-950'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full transition-colors ${
                        isActive
                          ? 'bg-teal-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Pharmacist Profile */}
        <div className="p-3 bg-gradient-to-b from-slate-900/90 to-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center font-black text-slate-950 text-xs shadow-md">
              RK
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">Vaidya R. K. Sharma</div>
              <div className="text-[10px] text-teal-400 font-medium">Head Pharmacist (GA/1482)</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="SLA 99.9% Uptime" />
        </div>
      </aside>

      {/* 2. MAIN EXECUTIVE CANVAS */}
      <main className="flex-1 flex flex-col bg-[#F8FAFC] text-slate-900 overflow-y-auto pb-16 md:pb-0">
        {/* Modern Frosted Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="space-y-0.5">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>VedaFlow</span>
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <span className="text-teal-600 font-bold capitalize">{activeTab}</span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
                {activeTab === 'products'
                  ? 'Catalog & Live Formulations'
                  : activeTab === 'prescriptions'
                  ? 'Prescription (Rx) Review & Substitute Matching'
                  : activeTab === 'orders'
                  ? 'Order Dispatch & Fulfillment Pipeline'
                  : activeTab === 'banners'
                  ? 'Hero Carousel Promotions & Banners'
                  : activeTab === 'inventory'
                  ? 'Botanical Stock & NABL Batch Clearance'
                  : activeTab === 'coupons'
                  ? 'Discount Coupons & Promotional Vouchers'
                  : activeTab === 'delivery'
                  ? 'Ekart Electric Vehicle Logistics'
                  : activeTab === 'share'
                  ? 'AI Marketing & Social Copy Studio'
                  : activeTab === 'analytics'
                  ? 'Revenue & Customer Savings Analytics'
                  : 'AYUSH Regulatory Compliance Audit'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100/80 px-2.5 py-1.5 rounded-lg border border-slate-200/60">
              <Command className="w-3.5 h-3.5 text-slate-400" />
              <span>⌘K Quick Switch</span>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100/80 px-3 py-1.5 rounded-lg border border-teal-200/80 flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Live Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500" />
            </div>
          </div>
        </header>

        {/* TAB 1: PRODUCTS & LIVE CATALOG */}
        {activeTab === 'products' && (
          <div className="p-4 sm:p-6 space-y-5">
            {/* Action Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    Medicines &amp; Botanical Remedies
                  </h2>
                  <span className="bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {products.length} Active Formulations
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Real-time catalog. Products published here immediately appear on the storefront, PDPs, and shopping cart.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-teal-700/20 transition-all active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Medicine</span>
              </button>
            </div>

            {/* Filter & Search */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search medicines by title, Hindi, or reference..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Filter:</span>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="w-full sm:w-auto text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                >
                  <option value="all">All Categories</option>
                  <option value="classical-rasayanas">Classical Rasayanas</option>
                  <option value="pure-shilajit">Pure Shilajit</option>
                  <option value="herbal-oils">Medicated Thailams &amp; Oils</option>
                  <option value="churnas-single-herbs">Churnas &amp; Single Herbs</option>
                  <option value="herbal-infusions-teas">Herbal Teas &amp; Kwath</option>
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[760px]">
                  <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="p-4">Remedy &amp; Classical Reference</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price &amp; MRP</th>
                      <th className="p-4">Inventory Units</th>
                      <th className="p-4">NABL Quality</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="w-12 h-12 object-cover rounded-xl border border-slate-200 shadow-xs shrink-0"
                            />
                            <div className="max-w-xs sm:max-w-sm space-y-0.5">
                              <div className="font-bold text-slate-900 line-clamp-1">{p.title}</div>
                              {p.hindiName && (
                                <div className="text-[11px] text-slate-500 font-serif line-clamp-1">
                                  {p.hindiName}
                                </div>
                              )}
                              {p.classicalReference && (
                                <div className="text-[10px] text-amber-700 italic font-mono">
                                  Ref: {p.classicalReference}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-teal-50 text-teal-800 font-bold px-2.5 py-1 rounded-lg text-[11px] border border-teal-200/60">
                            {p.categoryName}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <div className="font-black text-slate-900 text-sm">₹{p.price}</div>
                            {p.compareAtPrice > p.price && (
                              <div className="flex items-center gap-1.5">
                                <span className="line-through text-slate-400 text-[11px]">
                                  ₹{p.compareAtPrice}
                                </span>
                                <span className="text-emerald-700 font-black text-[10px]">
                                  {p.discountPct}% off
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <button
                              onClick={() => handleToggleStock(p.id)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all ${
                                p.inStock
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-800 border border-rose-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  p.inStock ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                              />
                              <span>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                            </button>
                            <div className="text-[10px] text-slate-400 pl-1">
                              {p.stockCount} units available
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            {p.nablCertified ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/80 w-fit">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Heavy Metal Pass</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Standard</span>
                            )}
                            <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span>{p.rating} ({p.reviews})</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`/products/${p.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                              title="View on Storefront"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete from catalog"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRESCRIPTION (RX) REVIEW & SUBSTITUTE MATCHING */}
        {activeTab === 'prescriptions' && (
          <div className="p-4 sm:p-6 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    Truemeds Prescription Audit Queue
                  </h2>
                  <span className="bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {prescriptions.filter((r) => r.status === 'PENDING_REVIEW').length} Pending Pharmacist Review
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Review customer doctor slips, verify active salts, and recommend 51% cheaper classical formulations.
                </p>
              </div>

              <div className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200/80 px-3.5 py-2 rounded-xl flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-600" />
                <span>On-Duty Pharmacist: Vaidya R. K. Sharma</span>
              </div>
            </div>

            {/* Prescriptions Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[760px]">
                  <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="p-4">Rx ID &amp; Time</th>
                      <th className="p-4">Patient / Contact</th>
                      <th className="p-4">Doctor Slip</th>
                      <th className="p-4">Customer Preference</th>
                      <th className="p-4">Recommended Classical Substitute</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Review</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {prescriptions.map((rx) => (
                      <tr key={rx.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4">
                          <div className="font-mono font-bold text-teal-700">{rx.id}</div>
                          <div className="text-[10px] text-slate-400">{rx.uploadedAt}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{rx.patientName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{rx.phone}</div>
                          <div className="text-[10px] text-slate-400">PIN: {rx.pin}</div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setViewingRx(rx)}
                            className="group relative block w-14 h-14 rounded-xl overflow-hidden border border-slate-200 hover:border-teal-500 shadow-xs"
                          >
                            <img
                              src={rx.imageUrl}
                              alt="Rx"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye className="w-4 h-4" />
                            </div>
                          </button>
                        </td>
                        <td className="p-4">
                          {rx.preference === 'substitute' ? (
                            <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-lg text-[10px] border border-emerald-200">
                              ⚡ Recommend 51% Cheaper Substitute
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-lg text-[10px]">
                              Exact Brands Only
                            </span>
                          )}
                        </td>
                        <td className="p-4 max-w-xs">
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            Prescribed: <span className="font-bold text-slate-800">{rx.prescribedDrug}</span>
                          </div>
                          <div className="text-[11px] text-teal-700 font-bold line-clamp-1">
                            Substitute: {rx.recommendedHerbal}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-black">
                            Saves Customer ~{rx.savingsEstimated}%
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              rx.status === 'PENDING_REVIEW'
                                ? 'bg-amber-100 text-amber-800'
                                : rx.status === 'SUBSTITUTE_RECOMMENDED'
                                ? 'bg-blue-100 text-blue-800'
                                : rx.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {rx.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setViewingRx(rx)}
                            className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                          >
                            Review &amp; Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS & EKART PIPELINE */}
        {activeTab === 'orders' && (
          <div className="p-4 sm:p-6 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    Ekart Dispatch Pipeline
                  </h2>
                  <span className="bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {orders.length} Active Shipments
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Update parcel fulfillment statuses or print official GST tax invoices.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Status Filter:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="text-xs font-bold border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-700"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PAID">PAID</option>
                  <option value="PACKED">PACKED</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[760px]">
                  <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="p-4">Order ID &amp; Date</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Items Summary</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Courier Assignment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4">
                          <div className="font-mono font-bold text-teal-700">{order.id}</div>
                          <div className="text-[10px] text-slate-400">{order.date}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{order.customer}</div>
                          <div className="text-[10px] text-slate-400">PIN: {order.pin} · {order.phone}</div>
                        </td>
                        <td className="p-4 max-w-xs">
                          <div className="text-slate-800 line-clamp-1">{order.itemsSummary}</div>
                          <div className="text-[10px] text-slate-400">{order.itemsCount} formulation unit(s)</div>
                        </td>
                        <td className="p-4">
                          <div className="font-black text-slate-900 text-sm">₹{order.amount}</div>
                          <div className="text-[10px] text-emerald-700 font-bold">
                            {order.paymentMethod.replace('_', ' ')}
                          </div>
                        </td>
                        <td className="p-4 text-slate-600">{order.courier}</td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.id, e.target.value as AdminOrder['status'])
                            }
                            className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border cursor-pointer ${
                              order.status === 'OUT_FOR_DELIVERY'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : order.status === 'PAID'
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : order.status === 'PACKED'
                                ? 'bg-purple-100 text-purple-800 border-purple-300'
                                : order.status === 'DELIVERED'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-rose-100 text-rose-800 border-rose-300'
                            }`}
                          >
                            <option value="PAID">PAID</option>
                            <option value="PACKED">PACKED</option>
                            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setPrintingOrder(order)}
                            className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors inline-flex items-center gap-1 font-bold"
                            title="Print GST Invoice"
                          >
                            <Printer className="w-4 h-4" />
                            <span>Invoice</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HERO BANNERS & PROMOTIONS */}
        {activeTab === 'banners' && (
          <div className="p-4 sm:p-6 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    Storefront Hero Carousel
                  </h2>
                  <span className="bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {banners.filter((b) => b.active).length} Active Banners
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Manage rotating banners on the homepage hero carousel.
                </p>
              </div>

              <button
                onClick={handleOpenAddBanner}
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Banner</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div
                    className={`relative p-6 bg-gradient-to-r ${banner.bgGradient} text-white min-h-[170px] flex flex-col justify-between overflow-hidden`}
                  >
                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div className="space-y-1.5 max-w-[70%]">
                        <span className="inline-block bg-[#ffe500] text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                          {banner.tag}
                        </span>
                        <h3 className="text-lg font-black leading-tight drop-shadow-xs">
                          {banner.title}
                        </h3>
                        <p className="text-xs text-white/90 line-clamp-2">
                          {banner.subtitle}
                        </p>
                      </div>

                      {banner.imageUrl && (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-white/20 shadow-md shrink-0 bg-white/10">
                          <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="relative z-10 pt-3 flex items-center justify-between">
                      <span className="inline-block bg-white text-slate-900 font-black text-xs px-3.5 py-1 rounded-lg shadow-sm">
                        {banner.ctaText} →
                      </span>
                      <span className="text-[10px] font-mono text-white/70 truncate max-w-[150px]">
                        Link: {banner.ctaLink}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold">
                    <button
                      onClick={() => handleToggleBanner(banner.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors ${
                        banner.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          banner.active ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      <span>{banner.active ? 'Active on Carousel' : 'Hidden'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditBanner(banner)}
                        className="px-2.5 py-1 text-slate-700 hover:text-teal-700 rounded-lg flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BOTANICAL INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Botanical Stock &amp; Batch Thresholds
                </h2>
                <p className="text-xs text-slate-500">
                  Quick stock adjustments and NABL Heavy Metal clearance logs.
                </p>
              </div>
              <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                AYUSH GMP Standards Pass
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th className="p-4">SKU / Medicine</th>
                    <th className="p-4">Available Units</th>
                    <th className="p-4">Quick Adjust</th>
                    <th className="p-4">NABL Heavy Metal Test</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{p.title}</div>
                        <div className="font-mono text-[10px] text-slate-400">ID: {p.id}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-black text-sm text-slate-900">{p.stockCount}</span> units
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleAdjustStock(p.id, -5)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-lg text-[10px]"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleAdjustStock(p.id, 10)}
                            className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 font-black rounded-lg text-[10px]"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleAdjustStock(p.id, 50)}
                            className="px-2.5 py-1 bg-teal-100 hover:bg-teal-200 text-teal-900 font-black rounded-lg text-[10px]"
                          >
                            +50
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Zero Lead/Mercury Pass</span>
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            p.stockCount > 15
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.stockCount > 0
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {p.stockCount > 15 ? 'OPTIMAL' : p.stockCount > 0 ? 'LOW STOCK' : 'OUT OF STOCK'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Discount Coupons &amp; Vouchers
                </h2>
                <p className="text-xs text-slate-500">
                  Manage promotional coupons for customer checkout.
                </p>
              </div>

              <button
                onClick={() => setIsCouponModalOpen(true)}
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-lg">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => handleToggleCoupon(coupon.code)}
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        coupon.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {coupon.active ? 'ACTIVE' : 'PAUSED'}
                    </button>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-slate-900 text-lg">{coupon.discountPct}% OFF</div>
                    <p className="text-slate-500 text-[11px]">{coupon.description}</p>
                    <div className="text-[10px] text-slate-400">Min Order: ₹{coupon.minOrder}</div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span>Used {coupon.usedCount.toLocaleString('en-IN')} times</span>
                    <span className="text-teal-700">Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: LOGISTICS & EV FLEET */}
        {activeTab === 'delivery' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
              <h2 className="text-lg font-black text-slate-900 mb-1">
                Ekart EV Fleet &amp; Logistics Hubs
              </h2>
              <p className="text-xs text-slate-500">
                19,000+ PIN codes served with zero-carbon electric couriers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="font-black text-slate-900 text-sm">Ramesh Kumar</div>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    ON ROUTE
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div>Vehicle: <span className="font-bold text-slate-900">EV Scooter (KA-01-EQ-9988)</span></div>
                  <div>Hub: <span className="font-medium text-slate-700">Bangalore South Hub</span></div>
                  <div>Active Dispatches: <span className="font-bold text-slate-900">2 Orders</span></div>
                  <div>Rating: <span className="font-bold text-emerald-700">★ 4.96 / 5.0</span></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="font-black text-slate-900 text-sm">Vikas Singh</div>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    AVAILABLE
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div>Vehicle: <span className="font-bold text-slate-900">Eco Bike (KA-05-MK-3312)</span></div>
                  <div>Hub: <span className="font-medium text-slate-700">Bangalore Central Hub</span></div>
                  <div>Active Dispatches: <span className="font-bold text-slate-900">0 Orders</span></div>
                  <div>Rating: <span className="font-bold text-emerald-700">★ 4.88 / 5.0</span></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="font-black text-slate-900 text-sm">Sanjay Dutt</div>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    ON ROUTE
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div>Vehicle: <span className="font-bold text-slate-900">EV Cargo (KA-02-EL-7744)</span></div>
                  <div>Hub: <span className="font-medium text-slate-700">Bangalore North Hub</span></div>
                  <div>Active Dispatches: <span className="font-bold text-slate-900">1 Order</span></div>
                  <div>Rating: <span className="font-bold text-emerald-700">★ 4.92 / 5.0</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: INSTAGRAM AD COPY STUDIO */}
        {activeTab === 'share' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-slate-900">
                  Organic Marketing &amp; Ad Studio
                </h2>
                <p className="text-xs text-slate-500">
                  Generate Truemeds-style savings captions and direct checkout links.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Select Formulation to Promote:</label>
                  <select
                    value={shareProduct}
                    onChange={(e) => setShareProduct(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-200 rounded-xl p-2.5 bg-slate-50"
                  >
                    <option value="swarna-bhasma-chyawanprash-1kg">Swarna Bhasma Amrit Chyawanprash (1kg)</option>
                    <option value="pure-himalayan-shilajit-resin-20g">Pure Himalayan Shilajit Resin (20g)</option>
                    <option value="kashmiri-saffron-kumkumadi-oil-30ml">Kashmiri Saffron Kumkumadi Night Oil (30ml)</option>
                    <option value="ksm66-organic-ashwagandha-root-extract">KSM-66 Organic Ashwagandha (60 caps)</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-wrap">
{`🌿 PURE AYURVEDA WELLNESS: Save up to 51% on genuine classical medicines! 🌿

Why pay ₹1,000+ for chemical supplements when authentic Charaka Samhita formulations give you 100% active bio-compounds with ZERO heavy metals?

✨ NABL Lab Tested with zero lead or mercury
✨ Up to 51% lower monthly medical expenditure
✨ Pan-India Express delivery via Ekart EV

👉 Order directly: https://veda.prigenix.com/products/${shareProduct}

#Ayurveda #Truemeds #VedaFlow #HolisticHealth #Save51Percent`}
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `🌿 PURE AYURVEDA WELLNESS: Save up to 51% on genuine classical medicines!\n\nOrder now: https://veda.prigenix.com/products/${shareProduct}`
                    );
                    setCopiedCaption(true);
                    setTimeout(() => setCopiedCaption(false), 2000);
                  }}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  {copiedCaption ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCaption ? 'Copied to Clipboard!' : 'Copy Instagram Ready Caption'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: ANALYTICS & KPIS */}
        {activeTab === 'analytics' && (
          <div className="p-4 sm:p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-2 shadow-xs">
                <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
                  <span>Today&apos;s Herbal Revenue</span>
                  <DollarSign className="w-4 h-4 text-teal-700" />
                </div>
                <div className="text-2xl font-black text-slate-900">₹1,84,400</div>
                <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +24.8% vs last week
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-2 shadow-xs">
                <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
                  <span>Customer Savings Generated</span>
                  <Percent className="w-4 h-4 text-teal-700" />
                </div>
                <div className="text-2xl font-black text-teal-800">₹94,280</div>
                <div className="text-xs font-bold text-teal-700">
                  Avg 51% saved per prescription
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-2 shadow-xs">
                <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
                  <span>Average Order Value</span>
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-black text-slate-900">₹860</div>
                <div className="text-xs font-bold text-slate-500">
                  High Chyawanprash + Shilajit basket size
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-2 shadow-xs">
                <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
                  <span>Customer Satisfaction</span>
                  <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">4.88 / 5.0</div>
                <div className="text-xs font-bold text-emerald-700">
                  Top 1% Ayurvedic E-Pharmacies
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: AYUSH COMPLIANCE AUDIT */}
        {activeTab === 'audit' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs min-w-[640px]">
                <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th className="p-4">Audit Event</th>
                    <th className="p-4">Verified Entity</th>
                    <th className="p-4">Compliance Standard</th>
                    <th className="p-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr className="hover:bg-slate-50/60">
                    <td className="p-4 font-mono font-bold text-teal-800">NABL_HEAVY_METAL_CoA_PASS</td>
                    <td className="p-4 text-slate-900">Batch #VD-2026-CHY-09 (Zero Lead/Mercury)</td>
                    <td className="p-4 text-emerald-700 font-bold">AYUSH Premium Standard</td>
                    <td className="p-4 text-slate-500 text-right">10 Mins ago</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="p-4 font-mono font-bold text-teal-800">CATALOG_PRODUCT_UPDATE</td>
                    <td className="p-4 text-slate-900">Dynamic Product Inventory Sync Verified</td>
                    <td className="p-4 text-emerald-700 font-bold">REST API Synchronized</td>
                    <td className="p-4 text-slate-500 text-right">15 Mins ago</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="p-4 font-mono font-bold text-teal-800">AYUSH_LICENSE_VERIFICATION</td>
                    <td className="p-4 text-slate-900">Ayurvedic Manufacturing License GA/1482 Active</td>
                    <td className="p-4 text-emerald-700 font-bold">Ministry of AYUSH</td>
                    <td className="p-4 text-slate-500 text-right">2 Hours ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* 3. Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 flex items-center justify-around py-1.5 shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 transition-colors ${
                isActive ? 'text-teal-700 font-black' : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-0.5">{item.shortLabel}</span>
            </button>
          );
        })}
      </nav>

      {/* 4. MODAL: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-gradient-to-r from-teal-700 to-emerald-700 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black">
                  {editingProductId ? 'Edit Ayurvedic Formulation' : 'Add New Herbal Product to Catalog'}
                </h3>
                <p className="text-xs text-teal-100">
                  Immediately updates the live storefront, PDPs, and shopping cart
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Product Title / Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    placeholder="e.g. Pure Himalayan Shilajit Resin 20g"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Hindi / Sanskrit Title</label>
                  <input
                    type="text"
                    value={productForm.hindiName}
                    onChange={(e) => setProductForm({ ...productForm, hindiName: e.target.value })}
                    placeholder="e.g. शुद्ध हिमालयन शिलाजीत स्वर्ण युक्त"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category *</label>
                  <select
                    value={productForm.categorySlug}
                    onChange={(e) => {
                      const sel = e.target.value;
                      const name =
                        sel === 'classical-rasayanas'
                          ? 'Classical Rasayanas'
                          : sel === 'pure-shilajit'
                          ? 'Pure Shilajit'
                          : sel === 'herbal-oils'
                          ? 'Medicated Thailams & Hair Oils'
                          : sel === 'churnas-single-herbs'
                          ? 'Churnas & Single Herbs'
                          : 'Herbal Infusions & Teas';
                      setProductForm({ ...productForm, categorySlug: sel, categoryName: name });
                    }}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  >
                    <option value="classical-rasayanas">Classical Rasayanas</option>
                    <option value="pure-shilajit">Pure Shilajit</option>
                    <option value="herbal-oils">Medicated Thailams &amp; Hair Oils</option>
                    <option value="churnas-single-herbs">Churnas &amp; Single Herbs</option>
                    <option value="herbal-infusions-teas">Herbal Infusions &amp; Teas</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">URL Slug</label>
                  <input
                    type="text"
                    value={productForm.slug}
                    onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                    placeholder="e.g. pure-himalayan-shilajit-resin-20g"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Selling Price (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Compare at / MRP (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={productForm.compareAtPrice}
                    onChange={(e) =>
                      setProductForm({ ...productForm, compareAtPrice: Number(e.target.value) })
                    }
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30 text-slate-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Inventory Units</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stockCount}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stockCount: Number(e.target.value) })
                    }
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Product Image URL *</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="flex-1 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  />
                  {productForm.image && (
                    <img
                      src={productForm.image}
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded-xl border border-slate-200 shadow-xs"
                    />
                  )}
                </div>

                <div className="pt-2 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-slate-400 font-bold">Pick Presets:</span>
                  {imagePresets.map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setProductForm({ ...productForm, image: preset.url })}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-semibold transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    className="w-4 h-4 text-teal-700 rounded-md"
                  />
                  <span className="font-bold text-slate-800">Immediately Available for Purchase</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors"
                  >
                    {editingProductId ? 'Save Changes' : 'Publish Formulation'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: ADD / EDIT BANNER */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-[#0B101E] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black">
                  {editingBannerId ? 'Edit Hero Banner' : 'Create New Promotional Hero Banner'}
                </h3>
                <p className="text-xs text-slate-400">Visible on the customer homepage slider</p>
              </div>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="p-5 sm:p-6 space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder="e.g. Ayurvedic Immunity Mahotsav - Up to 50% Off"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  placeholder="e.g. NABL Certified Classical Rasayanas &amp; Pure Shilajit"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Badge Tag</label>
                  <input
                    type="text"
                    value={bannerForm.tag}
                    onChange={(e) => setBannerForm({ ...bannerForm, tag: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">CTA Button Text</label>
                  <input
                    type="text"
                    value={bannerForm.ctaText}
                    onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Destination Link</label>
                <input
                  type="text"
                  value={bannerForm.ctaLink}
                  onChange={(e) => setBannerForm({ ...bannerForm, ctaLink: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Background Gradient Theme</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {gradientPresets.map((grad) => (
                    <button
                      key={grad.label}
                      type="button"
                      onClick={() => setBannerForm({ ...bannerForm, bgGradient: grad.value })}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        bannerForm.bgGradient === grad.value
                          ? 'border-teal-600 bg-teal-50/40 ring-1 ring-teal-500'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${grad.value} shrink-0 shadow-xs`} />
                      <span className="text-[11px] font-bold text-slate-800 truncate">{grad.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bannerForm.active}
                    onChange={(e) => setBannerForm({ ...bannerForm, active: e.target.checked })}
                    className="w-4 h-4 text-teal-700 rounded-md"
                  />
                  <span className="font-bold text-slate-800">Active (Visible on Carousel)</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBannerModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-xs"
                  >
                    {editingBannerId ? 'Update Banner' : 'Publish Banner'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: PRESCRIPTION AUDIT & APPROVAL */}
      {viewingRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-gradient-to-r from-teal-700 to-emerald-700 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black">
                  Prescription Review — {viewingRx.id}
                </h3>
                <p className="text-xs text-teal-100">
                  Patient: {viewingRx.patientName} ({viewingRx.phone} · PIN: {viewingRx.pin})
                </p>
              </div>
              <button
                onClick={() => setViewingRx(null)}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-full sm:w-1/2 border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-inner">
                  <img
                    src={viewingRx.imageUrl}
                    alt="Doctor Prescription Slip"
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-2.5 text-center text-[10px] text-slate-500 font-semibold bg-white border-t border-slate-200">
                    Uploaded Doctor&apos;s Prescription Slip
                  </div>
                </div>

                <div className="w-full sm:w-1/2 space-y-3">
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-black text-teal-800 uppercase tracking-wide">
                      Customer Savings Preference:
                    </span>
                    <div className="font-bold text-slate-800 text-xs">
                      {viewingRx.preference === 'substitute'
                        ? '⚡ Recommend 51% Cheaper Classical Substitute'
                        : '🔒 Supply Exact Brands Only'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Identified Chemical / Drug:</label>
                    <input
                      type="text"
                      defaultValue={viewingRx.prescribedDrug}
                      id="rx-drug-input"
                      className="w-full border border-slate-200 rounded-xl p-2.5 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Assigned Classical Herbal Substitute:</label>
                    <input
                      type="text"
                      defaultValue={viewingRx.recommendedHerbal}
                      id="rx-herbal-input"
                      className="w-full border border-slate-200 rounded-xl p-2.5 font-bold text-teal-700"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateRxStatus(viewingRx.id, 'REJECTED')}
                  className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 font-bold rounded-xl border border-rose-200"
                >
                  Reject Invalid Slip
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const input = (document.getElementById('rx-herbal-input') as HTMLInputElement)?.value;
                      handleUpdateRxStatus(viewingRx.id, 'SUBSTITUTE_RECOMMENDED', input);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    Suggest 51% Substitute
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const input = (document.getElementById('rx-herbal-input') as HTMLInputElement)?.value;
                      handleUpdateRxStatus(viewingRx.id, 'APPROVED', input);
                    }}
                    className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-black rounded-xl shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve &amp; Send WhatsApp Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: GST TAX INVOICE PRINT VIEW */}
      {printingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 my-auto text-xs animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">TAX INVOICE / CASH MEMO</h3>
                <p className="text-[10px] text-slate-500 font-mono">Invoice #: INV-{printingOrder.id}</p>
              </div>
              <button
                onClick={() => setPrintingOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[11px]">
              <div>
                <span className="font-bold text-slate-400 block">Sold By:</span>
                <div className="font-bold text-slate-900">VedaFlow Botanical Pharmacy</div>
                <div>Embassy Tech Village, Outer Ring Road</div>
                <div>Bengaluru, Karnataka 560103</div>
                <div>GSTIN: 29AABCV1234F1Z9</div>
                <div>AYUSH Lic: GA/1482</div>
              </div>

              <div>
                <span className="font-bold text-slate-400 block">Billed To (Customer):</span>
                <div className="font-bold text-slate-900">{printingOrder.customer}</div>
                <div>Phone: {printingOrder.phone}</div>
                <div>PIN: {printingOrder.pin}</div>
                <div>Ekart Express EV Delivery</div>
              </div>
            </div>

            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 font-bold border-b">
                <tr>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5">Qty</th>
                  <th className="p-2.5 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2.5 font-medium">{printingOrder.itemsSummary}</td>
                  <td className="p-2.5">{printingOrder.itemsCount}</td>
                  <td className="p-2.5 text-right font-bold">₹{printingOrder.amount}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between items-center pt-2 border-t font-black text-sm">
              <span>Grand Total Paid (Inc. 5% AYUSH GST):</span>
              <span className="text-teal-700">₹{printingOrder.amount}</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="bg-teal-700 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL: CREATE NEW COUPON */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-sm text-slate-900">Create New Coupon Code</h3>
              <button onClick={() => setIsCouponModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WELLNESS30"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-mono uppercase font-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Discount % *</label>
                  <input
                    type="number"
                    min="5"
                    max="80"
                    required
                    value={couponForm.discountPct}
                    onChange={(e) => setCouponForm({ ...couponForm, discountPct: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Min Cart Value (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={couponForm.minOrder}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrder: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Save 30% on classical Rasayanas"
                  value={couponForm.description}
                  onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-3.5 py-2 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-xl font-bold shadow-xs"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
