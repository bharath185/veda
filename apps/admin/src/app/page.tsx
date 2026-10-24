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
  stockCount?: number;
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
    bgGradient: 'from-[#0057b7] via-[#2874f0] to-[#0a84ff]',
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
    bgGradient: 'from-[#0b3d20] via-[#1b5e20] to-[#2e7d32]',
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
    bgGradient: 'from-[#b76e00] via-[#e65100] to-[#ff9800]',
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-597597143922?w=800&auto=format&fit=crop&q=80',
    active: true,
  },
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
  { label: 'Sapphire Blue (Flipkart)', value: 'from-[#0057b7] via-[#2874f0] to-[#0a84ff]' },
  { label: 'Forest Emerald (Ayush)', value: 'from-[#0b3d20] via-[#1b5e20] to-[#2e7d32]' },
  { label: 'Sunset Saffron (Veda)', value: 'from-[#b76e00] via-[#e65100] to-[#ff9800]' },
  { label: 'Deep Crimson Herbal', value: 'from-[#880e4f] via-[#b71c1c] to-[#c2185b]' },
  { label: 'Royal Midnight Slate', value: 'from-[#172337] via-[#263238] to-[#37474f]' },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'products' | 'banners' | 'orders' | 'inventory' | 'delivery' | 'share' | 'audit'
  >('products');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Products Management State
  const [products, setProducts] = useState<AdminProduct[]>(initialDefaultProducts);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Product Form State
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
    classicalReference: 'Charaka Samhita',
    badgesText: 'AYUSH Certified, NABL Tested, 100% Herbal',
    keyBenefitsText: 'Immunity, Vitality, Digestion',
    nablCertified: true,
    description: '',
  });

  // Banners Management State
  const [banners, setBanners] = useState<AdminBanner[]>(initialDefaultBanners);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  // Banner Form State
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

  // Marketing Share Generator State
  const [shareProduct, setShareProduct] = useState('swarna-bhasma-chyawanprash-1kg');
  const [sharePlatform, setSharePlatform] = useState('instagram');

  // Load live data from localStorage / API on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedProducts = localStorage.getItem(CATALOG_KEY);
        if (storedProducts) {
          const parsed = JSON.parse(storedProducts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          }
        }
        const storedBanners = localStorage.getItem(BANNERS_KEY);
        if (storedBanners) {
          const parsed = JSON.parse(storedBanners);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBanners(parsed);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to parse admin storage', e);
    }
  }, []);

  // Save products helper
  const persistProducts = (updated: AdminProduct[]) => {
    setProducts(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CATALOG_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('vedaflow_catalog_change'));
        // Sync via Next.js REST API
        fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated[0]),
        }).catch(() => {});
      } catch (err) {
        console.error('Failed saving products to storage', err);
      }
    }
  };

  // Save banners helper
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
        console.error('Failed saving banners to storage', err);
      }
    }
  };

  // Open modal for new product
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
      description: 'Handcrafted classical Ayurvedic medicine formulated strictly per ancient authentic Ayurvedic Pharmacopoeia of India (API) standards.',
    });
    setIsProductModalOpen(true);
  };

  // Open modal for editing product
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

  // Submit product form
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title.trim()) return;

    const discount =
      productForm.compareAtPrice > productForm.price
        ? Math.round(
            ((productForm.compareAtPrice - productForm.price) / productForm.compareAtPrice) * 100
          )
        : 0;

    const generatedSlug =
      productForm.slug.trim() ||
      productForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const badges = productForm.badgesText
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

    const keyBenefits = productForm.keyBenefitsText
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

    if (editingProductId) {
      // Update existing
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
    } else {
      // Add new
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
    }

    setIsProductModalOpen(false);
  };

  // Toggle product in-stock
  const handleToggleStock = (id: string) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        return { ...p, inStock: !p.inStock };
      }
      return p;
    });
    persistProducts(updated);
  };

  // Delete product
  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this Ayurvedic remedy from the catalog?')) {
      const updated = products.filter((p) => p.id !== id);
      persistProducts(updated);
    }
  };

  // Open modal for new banner
  const handleOpenAddBanner = () => {
    setEditingBannerId(null);
    setBannerForm({
      title: '',
      subtitle: '',
      tag: 'NEW EXCLUSIVE',
      ctaText: 'Explore Remedies',
      ctaLink: '/categories/classical-rasayanas',
      bgGradient: gradientPresets[0].value,
      imageUrl: imagePresets[0].url,
      active: true,
    });
    setIsBannerModalOpen(true);
  };

  // Open modal for editing banner
  const handleOpenEditBanner = (banner: AdminBanner) => {
    setEditingBannerId(banner.id);
    setBannerForm({
      title: banner.title,
      subtitle: banner.subtitle,
      tag: banner.tag,
      ctaText: banner.ctaText,
      ctaLink: banner.ctaLink,
      bgGradient: banner.bgGradient,
      imageUrl: banner.imageUrl || imagePresets[0].url,
      active: banner.active,
    });
    setIsBannerModalOpen(true);
  };

  // Submit banner form
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.title.trim()) return;

    if (editingBannerId) {
      const updated = banners.map((b) => {
        if (b.id === editingBannerId) {
          return {
            ...b,
            ...bannerForm,
          };
        }
        return b;
      });
      persistBanners(updated);
    } else {
      const newBanner: AdminBanner = {
        id: `banner-${Date.now()}`,
        ...bannerForm,
      };
      persistBanners([newBanner, ...banners]);
    }
    setIsBannerModalOpen(false);
  };

  // Toggle banner active status
  const handleToggleBanner = (id: string) => {
    const updated = banners.map((b) => {
      if (b.id === id) {
        return { ...b, active: !b.active };
      }
      return b;
    });
    persistBanners(updated);
  };

  // Delete banner
  const handleDeleteBanner = (id: string) => {
    if (confirm('Delete this banner from homepage carousel?')) {
      const updated = banners.filter((b) => b.id !== id);
      persistBanners(updated);
    }
  };

  // Filtered products list
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

  // Operational mock data
  const orders = [
    { id: 'OD-VEDA-8421098', customer: 'Priya Sharma', amount: 1499, status: 'OUT_FOR_DELIVERY', items: 1, date: '12 Mins ago', courier: 'Ekart / Ramesh (EV Scooter)', pin: '560001' },
    { id: 'OD-VEDA-7319401', customer: 'Dr. Anand Joshi', amount: 2598, status: 'PAID', items: 3, date: '28 Mins ago', courier: 'Ready to Dispatch', pin: '400001' },
    { id: 'OD-VEDA-6104882', customer: 'Sneha Patel', amount: 3797, status: 'PACKED', items: 2, date: '1 Hour ago', courier: 'Ekart Logistics', pin: '380015' },
    { id: 'OD-VEDA-5822190', customer: 'Meera Nambiar', amount: 1299, status: 'DELIVERED', items: 1, date: '3 Hours ago', courier: 'Ekart / Ramesh (EV Scooter)', pin: '682001' },
  ];

  const inventoryAlerts = [
    { sku: 'VD-SHILAJIT-GOLD', title: 'Pure Himalayan Shilajit Resin 20g', stock: 4, threshold: 10, status: 'CRITICAL', supplier: 'Himalayan High-Altitude Foragers', batch: 'VD-2026-SHI-14' },
    { sku: 'VD-ASHWA-KSM66', title: 'KSM-66 Organic Ashwagandha 600mg', stock: 8, threshold: 15, status: 'LOW_STOCK', supplier: 'Ixoreal Biomed Extracts', batch: 'VD-2026-ASH-08' },
    { sku: 'VD-KUMKUMADI-30', title: 'Kashmiri Saffron Kumkumadi Night Oil 30ml', stock: 6, threshold: 12, status: 'LOW_STOCK', supplier: 'Pampore Saffron Cooperatives', batch: 'VD-2026-KUM-03' },
    { sku: 'VD-SWARNA-1KG', title: 'Swarna Bhasma Amrit Chyawanprash 1kg', stock: 7, threshold: 10, status: 'REORDER_SOON', supplier: 'Kerala Veda Botanical Pharmacy', batch: 'VD-2026-CHY-09' },
  ];

  const deliveryAgents = [
    { name: 'Ramesh Kumar', vehicle: 'EV Scooter (KA-01-EQ-9988)', activeOrders: 2, rating: 4.96, status: 'ON_ROUTE', hub: 'Bangalore South Hub' },
    { name: 'Vikas Singh', vehicle: 'Eco Bike (KA-05-MK-3312)', activeOrders: 0, rating: 4.88, status: 'AVAILABLE', hub: 'Bangalore Central Hub' },
    { name: 'Sanjay Dutt', vehicle: 'EV Cargo (KA-02-EL-7744)', activeOrders: 1, rating: 4.92, status: 'ON_ROUTE', hub: 'Bangalore North Hub' },
  ];

  const auditLogs = [
    { action: 'NABL_HEAVY_METAL_CoA_PASS', user: 'admin@vedaflow.org', entity: 'Batch #VD-2026-CHY-09 (Zero Lead/Mercury)', ip: '103.21.244.1', time: '10 Mins ago' },
    { action: 'CATALOG_PRODUCT_UPDATE', user: 'admin@vedaflow.org', entity: 'Dynamic Product Inventory Sync Verified', ip: '103.21.244.1', time: '15 Mins ago' },
    { action: 'UPDATE_ORDER_DISPATCH', user: 'admin@vedaflow.org', entity: 'Order OD-VEDA-8421098 Assigned to Ekart', ip: '103.21.244.1', time: '18 Mins ago' },
    { action: 'COUPON_ACTIVATE_HERBAL20', user: 'admin@vedaflow.org', entity: 'Coupon HERBAL20 (20% Off Rasayanas)', ip: '103.21.244.1', time: '1 Hour ago' },
    { action: 'AYUSH_LICENSE_VERIFICATION', user: 'admin@vedaflow.org', entity: 'License GA/1482 Renewal Validated', ip: '103.21.244.1', time: '2 Hours ago' },
  ];

  const navItems = [
    { id: 'products' as const, label: 'Products & Live Catalog', shortLabel: 'Products', icon: Package },
    { id: 'banners' as const, label: 'Hero Banners & Promotions', shortLabel: 'Banners', icon: Sparkles },
    { id: 'analytics' as const, label: 'Sales & SuperCoins', shortLabel: 'Sales', icon: TrendingUp },
    { id: 'orders' as const, label: 'Orders & Ekart Dispatch', shortLabel: 'Orders', icon: ShoppingBag },
    { id: 'inventory' as const, label: 'Botanical Stock & NABL', shortLabel: 'Stock', icon: Layers },
    { id: 'delivery' as const, label: 'Logistics & EV Fleet', shortLabel: 'Fleet', icon: Truck },
    { id: 'share' as const, label: 'Instagram Ad & Studio', shortLabel: 'Studio', icon: Share2 },
    { id: 'audit' as const, label: 'AYUSH Compliance Audit', shortLabel: 'Audit', icon: ShieldCheck },
  ];

  const handleSelectTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#F0F2F5] text-slate-800 font-sans overflow-hidden">
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* 1. Flipkart Seller Hub Blue & Slate Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#172337] text-slate-200 flex flex-col justify-between p-3 shrink-0 shadow-xl md:shadow-lg transform transition-transform duration-200 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* Brand + Close button on mobile */}
          <div className="p-3 border-b border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black italic tracking-tight text-white">
                  Veda<span className="text-[#ffe500]">Flow</span>
                </span>
                <span className="text-[9px] bg-[#2874f0] text-white font-black px-1 rounded-2xs uppercase">
                  SELLER HUB
                </span>
              </div>
              <span className="block text-[10px] font-bold text-slate-400 mt-0.5">
                Ayurvedic Merchant Control Center
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-xs text-slate-400 hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xs text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-[#2874f0] text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Seller Info Card */}
        <div className="border-t border-slate-700/80 pt-3 p-2 bg-slate-900/60 rounded-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-black text-white">Vaidya R. K. Sharma</div>
              <div className="text-[10px] text-[#ffe500] font-bold">Tier: Gold Seller (99.4% SLA)</div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Connected to Ekart Hub" />
          </div>
        </div>
      </aside>

      {/* 2. Main Executive View Area */}
      <main className="flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0">
        {/* Top Header Bar */}
        <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 rounded-xs md:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-sm sm:text-base font-black text-slate-900 capitalize truncate">
              {activeTab === 'products'
                ? 'Products & Live Catalog'
                : activeTab === 'banners'
                ? 'Hero Banners & Promotions'
                : `${activeTab} Overview`}
            </h1>
            <span className="hidden sm:flex text-[11px] font-bold bg-blue-50 text-[#2874f0] border border-blue-200 px-2 py-0.5 rounded-xs items-center gap-1">
              <Award className="w-3.5 h-3.5" /> AYUSH Certified Platform
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#2874f0] hover:bg-blue-50 px-2.5 sm:px-3 py-1.5 rounded-xs border border-blue-200 flex items-center gap-1 transition-colors"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="hidden lg:block text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xs">
              Flipkart Seller Architecture · Real-time Catalog
            </div>
          </div>
        </header>

        {/* TAB: PRODUCTS & CATALOG MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            {/* Action Bar & Quick Stats */}
            <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Ayurvedic Remedies & Live Inventory
                  </h2>
                  <span className="bg-blue-100 text-[#2874f0] text-xs font-bold px-2 py-0.5 rounded-full">
                    {products.length} Products Live
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Add, edit, toggle stock, or sell any Ayurvedic formulation. Changes immediately sync across the storefront, category listings, search, and cart.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="bg-[#2874f0] hover:bg-[#1a5bc4] text-white font-bold text-xs px-4 py-2.5 rounded-xs flex items-center justify-center gap-2 shadow-sm transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product / Medicine</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white border border-slate-200 rounded-sm p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search products by title, Hindi, or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-xs text-xs focus:outline-hidden focus:border-[#2874f0]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Category:</span>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="w-full sm:w-auto text-xs font-bold border border-slate-300 rounded-xs px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden focus:border-[#2874f0]"
                >
                  <option value="all">All Formulations</option>
                  <option value="classical-rasayanas">Classical Rasayanas</option>
                  <option value="pure-shilajit">Pure Shilajit</option>
                  <option value="herbal-oils">Medicated Thailams & Hair Oils</option>
                  <option value="churnas-single-herbs">Churnas & Single Herbs</option>
                  <option value="herbal-infusions-teas">Herbal Infusions & Teas</option>
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[760px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">Product / Remedy</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price & MRP</th>
                      <th className="p-3">Stock Status</th>
                      <th className="p-3">Compliance</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="w-12 h-12 object-cover rounded-xs border border-slate-200 bg-slate-50 shrink-0"
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
                        <td className="p-3">
                          <span className="bg-blue-50 text-[#2874f0] font-bold px-2 py-0.5 rounded-2xs text-[11px]">
                            {p.categoryName}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="space-y-0.5">
                            <div className="font-black text-slate-900 text-sm">₹{p.price}</div>
                            {p.compareAtPrice > p.price && (
                              <div className="flex items-center gap-1.5">
                                <span className="line-through text-slate-400 text-[11px]">
                                  ₹{p.compareAtPrice}
                                </span>
                                <span className="text-[#388e3c] font-black text-[10px]">
                                  {p.discountPct}% off
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleStock(p.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs font-bold text-[11px] transition-colors ${
                              p.inStock
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                            }`}
                            title="Click to toggle stock availability"
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                p.inStock ? 'bg-emerald-500' : 'bg-red-500'
                              }`}
                            />
                            <span>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                          </button>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col gap-1">
                            {p.nablCertified ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-2xs border border-emerald-200 w-fit">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" /> NABL Heavy Metal Pass
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
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`/products/${p.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-500 hover:text-[#2874f0] hover:bg-slate-100 rounded-xs transition-colors"
                              title="View on Storefront"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 text-slate-600 hover:text-[#2874f0] hover:bg-slate-100 rounded-xs transition-colors"
                              title="Edit formulation details"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xs transition-colors"
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

        {/* TAB: BANNERS & PROMOTIONS MANAGEMENT */}
        {activeTab === 'banners' && (
          <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            {/* Banner Header */}
            <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Storefront Hero Carousel & Promotional Banners
                  </h2>
                  <span className="bg-blue-100 text-[#2874f0] text-xs font-bold px-2 py-0.5 rounded-full">
                    {banners.filter((b) => b.active).length} Active Banners
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Control the hero banners displayed on the homepage slider. Customize background gradients, headlines, badges, call-to-action buttons, and featured imagery.
                </p>
              </div>

              <button
                onClick={handleOpenAddBanner}
                className="bg-[#2874f0] hover:bg-[#1a5bc4] text-white font-bold text-xs px-4 py-2.5 rounded-xs flex items-center justify-center gap-2 shadow-sm transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Banner</span>
              </button>
            </div>

            {/* Banners Grid Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  {/* Banner Card Visual Preview */}
                  <div
                    className={`relative p-5 sm:p-6 bg-gradient-to-r ${banner.bgGradient} text-white min-h-[160px] flex flex-col justify-between overflow-hidden`}
                  >
                    {/* Background glow or subtle decoration */}
                    <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div className="space-y-2 max-w-[70%]">
                        <span className="inline-block bg-[#ffe500] text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-2xs shadow-xs">
                          {banner.tag}
                        </span>
                        <h3 className="text-lg sm:text-xl font-black leading-tight drop-shadow-xs">
                          {banner.title}
                        </h3>
                        <p className="text-xs text-white/90 line-clamp-2">
                          {banner.subtitle}
                        </p>
                      </div>

                      {banner.imageUrl && (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xs overflow-hidden border border-white/20 shadow-md shrink-0 bg-white/10">
                          <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="relative z-10 pt-4 flex items-center justify-between">
                      <span className="inline-block bg-white text-[#2874f0] font-black text-xs px-3.5 py-1.5 rounded-xs shadow-sm">
                        {banner.ctaText} →
                      </span>
                      <span className="text-[10px] font-mono text-white/70 truncate max-w-[150px]">
                        Link: {banner.ctaLink}
                      </span>
                    </div>
                  </div>

                  {/* Banner Controls */}
                  <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleBanner(banner.id)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-xs transition-colors ${
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
                        <span>{banner.active ? 'Active on Carousel' : 'Hidden / Paused'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditBanner(banner)}
                        className="px-2.5 py-1 text-slate-700 hover:text-[#2874f0] hover:bg-slate-200 rounded-xs flex items-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="px-2.5 py-1 text-red-600 hover:bg-red-50 rounded-xs flex items-center gap-1 transition-colors"
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

        {/* Tab 1: Real-time Analytics & KPIs */}
        {activeTab === 'analytics' && (
          <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white border border-slate-200 rounded-sm p-4 space-y-2 shadow-xs">
                <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
                  <span>Today's Herbal Revenue</span>
                  <DollarSign className="w-4 h-4 text-[#2874f0]" />
                </div>
                <div className="text-2xl font-black text-slate-900">₹1,84,400</div>
                <div className="text-xs font-bold text-[#388e3c] flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +24.8% vs last week
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-sm p-4 space-y-2 shadow-xs">
                <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
                  <span>Remedies To Dispatch</span>
                  <Package className="w-4 h-4 text-[#fb641b]" />
                </div>
                <div className="text-2xl font-black text-slate-900">18 Orders</div>
                <div className="text-xs font-bold text-[#388e3c]">
                  0 SLA Breaches · 100% on-time packing
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-sm p-4 space-y-2 shadow-xs">
                <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
                  <span>Average Order Value</span>
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-black text-slate-900">₹860</div>
                <div className="text-xs font-bold text-slate-500">
                  High Chyawanprash + Shilajit basket size
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-sm p-4 space-y-2 shadow-xs">
                <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
                  <span>Customer Satisfaction</span>
                  <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">4.88 / 5.0</div>
                <div className="text-xs font-bold text-[#388e3c]">
                  Top 1% Ayurvedic Sellers on Flipkart
                </div>
              </div>
            </div>

            {/* Visual Funnel and Acquisition Mix */}
            <div className="grid grid-cols-12 gap-4 sm:gap-6">
              <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-sm p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-sm font-black text-slate-900">
                      Conversion Funnel (Flipkart Ayurvedic Traffic)
                    </h2>
                    <span className="text-xs text-slate-500">
                      Hourly traffic converted into verified orders
                    </span>
                  </div>
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-xs border border-emerald-200">
                    Live Session Flow
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-600">Storefront Product Views</span>
                      <span className="text-slate-900">14,280 visits (100%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-xs overflow-hidden">
                      <div className="h-full bg-[#2874f0] rounded-xs" style={{ width: '100%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-600">Added to Ayurvedic Cart</span>
                      <span className="text-slate-900">2,856 carts (20.0%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-xs overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-xs" style={{ width: '20%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-600">Entered Checkout & Verified OTP</span>
                      <span className="text-slate-900">1,428 customers (10.0%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-xs overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-xs" style={{ width: '10%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-600">Payment Completed (Razorpay / UPI / COD)</span>
                      <span className="text-emerald-700 font-black">814 successful orders (5.7%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-xs overflow-hidden">
                      <div className="h-full bg-[#388e3c] rounded-xs" style={{ width: '5.7%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-sm p-4 sm:p-5 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-black text-slate-900">Top Remedies by Revenue</h2>
                  <span className="text-xs text-slate-500">Highest grossing formulations</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">Swarna Bhasma Chyawanprash</div>
                      <div className="text-[10px] text-slate-400">420 units sold</div>
                    </div>
                    <div className="font-black text-slate-900">₹7,97,580</div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">Pure Himalayan Shilajit 20g</div>
                      <div className="text-[10px] text-slate-400">380 units sold</div>
                    </div>
                    <div className="font-black text-slate-900">₹5,69,620</div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">Kashmiri Kumkumadi Oil</div>
                      <div className="text-[10px] text-slate-400">290 units sold</div>
                    </div>
                    <div className="font-black text-slate-900">₹2,89,710</div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">KSM-66 Ashwagandha 600mg</div>
                      <div className="text-[10px] text-slate-400">310 units sold</div>
                    </div>
                    <div className="font-black text-slate-900">₹2,16,690</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders & Ekart Dispatch */}
        {activeTab === 'orders' && (
          <div className="p-3 sm:p-6 space-y-4">
            <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="space-y-0.5">
                  <h2 className="text-sm font-black text-slate-900">Ekart Fulfillment & Order Pipeline</h2>
                  <p className="text-xs text-slate-500">Real-time status of orders, pin codes, and EV courier tracking</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Fast Filter:</span>
                  <span className="text-xs font-bold bg-[#2874f0] text-white px-2.5 py-1 rounded-xs">All Orders</span>
                </div>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Remedy Items</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Destination Pin</th>
                      <th className="p-3">Courier Logistics</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#2874f0]">{order.id}</td>
                        <td className="p-3 font-bold text-slate-900">{order.customer}</td>
                        <td className="p-3 text-slate-600">{order.items} formulation(s)</td>
                        <td className="p-3 font-bold text-slate-900">₹{order.amount}</td>
                        <td className="p-3 font-mono text-slate-500">{order.pin}</td>
                        <td className="p-3 text-slate-600">{order.courier}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-2xs text-[10px] font-black uppercase tracking-wider ${
                              order.status === 'OUT_FOR_DELIVERY'
                                ? 'bg-amber-100 text-amber-800'
                                : order.status === 'PAID'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'PACKED'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Botanical Stock & Inventory Alerts */}
        {activeTab === 'inventory' && (
          <div className="p-3 sm:p-6 space-y-4">
            <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-200 bg-amber-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <div>
                    <h2 className="text-sm font-black text-slate-900">
                      Botanical Raw Material & Finished Goods Stock Alerts
                    </h2>
                    <span className="text-xs text-slate-500">
                      Monitored against seasonal harvesting cycles and AYUSH GMP batch size
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold bg-amber-200 text-amber-900 px-2.5 py-1 rounded-xs">
                  4 Items Below Threshold
                </span>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Herbal Remedy</th>
                      <th className="p-3">Current Units</th>
                      <th className="p-3">Reorder Point</th>
                      <th className="p-3">Primary Botanical Supplier</th>
                      <th className="p-3">Active Batch</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {inventoryAlerts.map((inv) => (
                      <tr key={inv.sku} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-500">{inv.sku}</td>
                        <td className="p-3 font-bold text-slate-900">{inv.title}</td>
                        <td className="p-3 font-black text-slate-900">{inv.stock}</td>
                        <td className="p-3 text-slate-500">{inv.threshold}</td>
                        <td className="p-3 text-slate-600">{inv.supplier}</td>
                        <td className="p-3 font-mono text-[11px] text-slate-500">{inv.batch}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-2xs text-[10px] font-black uppercase ${
                              inv.status === 'CRITICAL'
                                ? 'bg-red-100 text-red-800'
                                : inv.status === 'LOW_STOCK'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {inv.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Logistics & EV Fleet */}
        {activeTab === 'delivery' && (
          <div className="p-3 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {deliveryAgents.map((agent) => (
                <div key={agent.name} className="bg-white border border-slate-200 rounded-sm p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="font-black text-slate-900 text-sm">{agent.name}</div>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-2xs ${
                        agent.status === 'ON_ROUTE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {agent.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <div>Vehicle: <span className="font-bold text-slate-900">{agent.vehicle}</span></div>
                    <div>Dispatch Hub: <span className="font-medium text-slate-700">{agent.hub}</span></div>
                    <div>Active Dispatches: <span className="font-bold text-slate-900">{agent.activeOrders}</span></div>
                    <div>Customer Rating: <span className="font-bold text-emerald-700">★ {agent.rating} / 5.0</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Instagram Ad & Marketing Studio */}
        {activeTab === 'share' && (
          <div className="p-3 sm:p-6 space-y-6">
            <div className="bg-white border border-slate-200 rounded-sm p-4 sm:p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-base font-black text-slate-900">
                  Organic Instagram & WhatsApp Marketing Studio
                </h2>
                <p className="text-xs text-slate-500">
                  Generate high-conversion viral Ayurvedic posts, captions, and direct checkout links without expensive agency retainers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Select Formulation to Promote:</label>
                  <select
                    value={shareProduct}
                    onChange={(e) => setShareProduct(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-300 rounded-xs p-2 bg-white"
                  >
                    <option value="swarna-bhasma-chyawanprash-1kg">Swarna Bhasma Amrit Chyawanprash (1kg)</option>
                    <option value="pure-himalayan-shilajit-resin-20g">Pure Himalayan Shilajit Resin (20g)</option>
                    <option value="kashmiri-saffron-kumkumadi-oil-30ml">Kashmiri Saffron Kumkumadi Night Oil (30ml)</option>
                    <option value="ksm66-organic-ashwagandha-root-extract">KSM-66 Organic Ashwagandha (60 caps)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Target Channel:</label>
                  <select
                    value={sharePlatform}
                    onChange={(e) => setSharePlatform(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-300 rounded-xs p-2 bg-white"
                  >
                    <option value="instagram">Instagram Carousel / Reel Caption</option>
                    <option value="whatsapp">WhatsApp Broadcast to Herbal Customers</option>
                    <option value="google">Google Shopping Ad Copy</option>
                  </select>
                </div>
              </div>

              {/* Generated Copy Preview Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xs p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>AI Optimized Organic Marketing Copy:</span>
                  <span className="text-emerald-700">Ready to post</span>
                </div>
                <div className="bg-white p-3 rounded-xs border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-wrap">
{`🌿 Pure Ayurvedic Potency. Zero Shortcuts. 🌿

Are you taking authentic classical Rasayana or sugar-loaded generic tonics?
At VedaFlow, our formulation is crafted per Charaka Samhita guidelines:
✨ 24K Certified Gold Bhasma for deep cellular vitality (Ojas)
✨ A2 Gir Cow Bilona Ghee & Wild Raw Honey base
✨ NABL Heavy Metal Tested with zero lead or mercury

🔥 Exclusive Offer: Get 37% OFF + Free Ekart EV delivery today!
👉 Tap the link in bio or order now: https://vedaflow-theta.vercel.app/products/${shareProduct}

#Ayurveda #NaturalHealing #VedaFlow #CharakaSamhita #HolisticHealth #NABLTested #SwarnaBhasma`}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `🌿 Pure Ayurvedic Potency. Zero Shortcuts. 🌿\n\nOrder now: https://vedaflow-theta.vercel.app/products/${shareProduct}`
                      );
                      setCopiedCaption(true);
                      setTimeout(() => setCopiedCaption(false), 2000);
                    }}
                    className="flex-1 bg-[#2874f0] hover:bg-[#1a5bc4] text-white font-bold py-2 rounded-xs flex items-center justify-center gap-1.5 text-xs transition-colors"
                  >
                    {copiedCaption ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCaption ? 'Copied to Clipboard!' : 'Copy Instagram Ready Caption'}</span>
                  </button>

                  <a
                    href={`/products/${shareProduct}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xs text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Live Product Card</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Audit Logs & Regulatory Compliance */}
        {activeTab === 'audit' && (
          <div className="p-3 sm:p-6 space-y-4">
            <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-xs">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs min-w-[640px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">Action / Log</th>
                      <th className="p-3">Operator</th>
                      <th className="p-3">Affected Entity</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {auditLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#2874f0]">{log.action}</td>
                        <td className="p-3 font-semibold text-slate-900">{log.user}</td>
                        <td className="p-3 text-slate-700">{log.entity}</td>
                        <td className="p-3 font-mono text-slate-500">{log.ip}</td>
                        <td className="p-3 text-slate-500 text-right">{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-30 flex items-center justify-around py-1 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 transition-colors ${
                isActive ? 'text-[#2874f0] font-black' : 'text-slate-500 font-medium hover:text-slate-800'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-sm border border-slate-300 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-4 bg-[#2874f0] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black">
                  {editingProductId ? 'Edit Ayurvedic Formulation' : 'Add New Herbal Product to Catalog'}
                </h3>
                <p className="text-xs text-blue-100">
                  Changes will immediately reflect on the live storefront and customer cart
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-white/80 hover:text-white rounded-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveProduct} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Product Title / Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    placeholder="e.g. Pure Himalayan Shilajit Resin 20g"
                    className="w-full border border-slate-300 rounded-xs p-2 text-xs focus:outline-hidden focus:border-[#2874f0]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Hindi / Sanskrit Title</label>
                  <input
                    type="text"
                    value={productForm.hindiName}
                    onChange={(e) => setProductForm({ ...productForm, hindiName: e.target.value })}
                    placeholder="e.g. शुद्ध हिमालयन शिलाजीत स्वर्ण युक्त"
                    className="w-full border border-slate-300 rounded-xs p-2 text-xs focus:outline-hidden focus:border-[#2874f0]"
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
                    className="w-full border border-slate-300 rounded-xs p-2 text-xs bg-white focus:outline-hidden focus:border-[#2874f0]"
                  >
                    <option value="classical-rasayanas">Classical Rasayanas</option>
                    <option value="pure-shilajit">Pure Shilajit</option>
                    <option value="herbal-oils">Medicated Thailams & Hair Oils</option>
                    <option value="churnas-single-herbs">Churnas & Single Herbs</option>
                    <option value="herbal-infusions-teas">Herbal Infusions & Teas</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">URL Slug (leave blank to auto-generate)</label>
                  <input
                    type="text"
                    value={productForm.slug}
                    onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                    placeholder="e.g. pure-himalayan-shilajit-resin-20g"
                    className="w-full border border-slate-300 rounded-xs p-2 text-xs font-mono focus:outline-hidden focus:border-[#2874f0]"
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
                    className="w-full border border-slate-300 rounded-xs p-2 text-xs focus:outline-hidden focus:border-[#2874f0]"
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
                    className="w-full border border-slate-300 rounded-xs p-2 text-xs focus:outline-hidden focus:border-[#2874f0]"
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
                    className="w-full border border-slate-300 rounded-xs p-2 text-xs focus:outline-hidden focus:border-[#2874f0]"
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
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 border border-slate-300 rounded-xs p-2 text-xs focus:outline-hidden focus:border-[#2874f0]"
                  />
                  {productForm.image && (
                    <img
                      src={productForm.image}
                      alt="Preview"
                      className="w-9 h-9 object-cover rounded-xs border border-slate-200"
                    />
                  )}
                </div>
                {/* Preset image picker */}
                <div className="pt-1.5 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-slate-500 font-bold">Pick Preset Photo:</span>
                  {imagePresets.map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setProductForm({ ...productForm, image: preset.url })}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-xs font-semibold"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Classical Reference (Grantha / Sutra)</label>
                <input
                  type="text"
                  value={productForm.classicalReference}
                  onChange={(e) =>
                    setProductForm({ ...productForm, classicalReference: e.target.value })
                  }
                  placeholder="e.g. Charaka Samhita Chikitsa Sthana 1.3"
                  className="w-full border border-slate-300 rounded-xs p-2 text-xs focus:outline-hidden focus:border-[#2874f0]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Key Benefits (comma-separated)</label>
                <input
                  type="text"
                  value={productForm.keyBenefitsText}
                  onChange={(e) => setProductForm({ ...productForm, keyBenefitsText: e.target.value })}
                  placeholder="e.g. Boosts Stamina, Rejuvenates Cells, Increases Ojas"
                  className="w-full border border-slate-300 rounded-xs p-2 text-xs focus:outline-hidden focus:border-[#2874f0]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Badges & Certifications (comma-separated)</label>
                <input
                  type="text"
                  value={productForm.badgesText}
                  onChange={(e) => setProductForm({ ...productForm, badgesText: e.target.value })}
                  placeholder="e.g. AYUSH Certified, NABL Lab Tested, Cold-Pressed"
                  className="w-full border border-slate-300 rounded-xs p-2 text-xs focus:outline-hidden focus:border-[#2874f0]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Detailed Description & Preparation</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Describe botanical ingredients, harvesting location, and preparation method..."
                  className="w-full border border-slate-300 rounded-xs p-2 text-xs focus:outline-hidden focus:border-[#2874f0]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    className="w-4 h-4 text-[#2874f0] rounded-xs"
                  />
                  <span className="font-bold text-slate-800">Immediately Available for Purchase (In Stock)</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xs hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#2874f0] hover:bg-[#1a5bc4] text-white font-bold rounded-xs shadow-xs transition-colors"
                  >
                    {editingProductId ? 'Save Product Changes' : 'Publish to Storefront'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: ADD / EDIT BANNER */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-sm border border-slate-300 shadow-2xl max-w-xl w-full flex flex-col overflow-hidden my-auto">
            <div className="p-4 bg-[#172337] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black">
                  {editingBannerId ? 'Edit Hero Banner' : 'Create New Promotional Hero Banner'}
                </h3>
                <p className="text-xs text-slate-300">
                  Visible on the homepage rotating carousel
                </p>
              </div>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="p-1 text-white/80 hover:text-white rounded-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="p-4 sm:p-6 space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder="e.g. Ayurvedic Immunity Mahotsav - Up to 50% Off"
                  className="w-full border border-slate-300 rounded-xs p-2 text-xs focus:outline-hidden focus:border-[#2874f0]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  placeholder="e.g. NABL Certified Classical Rasayanas & Pure Shilajit"
                  className="w-full border border-slate-300 rounded-xs p-2 text-xs focus:outline-hidden focus:border-[#2874f0]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Badge Tag</label>
                  <input
                    type="text"
                    value={bannerForm.tag}
                    onChange={(e) => setBannerForm({ ...bannerForm, tag: e.target.value })}
                    placeholder="e.g. FLIPKART SPECIAL"
                    className="w-full border border-slate-300 rounded-xs p-2 text-xs focus:outline-hidden focus:border-[#2874f0]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">CTA Button Text</label>
                  <input
                    type="text"
                    value={bannerForm.ctaText}
                    onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                    placeholder="e.g. Shop Now"
                    className="w-full border border-slate-300 rounded-xs p-2 text-xs focus:outline-hidden focus:border-[#2874f0]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Destination Link</label>
                <input
                  type="text"
                  value={bannerForm.ctaLink}
                  onChange={(e) => setBannerForm({ ...bannerForm, ctaLink: e.target.value })}
                  placeholder="e.g. /categories/classical-rasayanas"
                  className="w-full border border-slate-300 rounded-xs p-2 text-xs font-mono focus:outline-hidden focus:border-[#2874f0]"
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
                      className={`p-2 rounded-xs border text-left flex items-center gap-2 ${
                        bannerForm.bgGradient === grad.value
                          ? 'border-[#2874f0] ring-1 ring-[#2874f0]'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-xs bg-gradient-to-r ${grad.value} shrink-0`} />
                      <span className="text-[11px] font-bold text-slate-800 truncate">{grad.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Featured Image URL (Optional)</label>
                <input
                  type="url"
                  value={bannerForm.imageUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border border-slate-300 rounded-xs p-2 text-xs focus:outline-hidden focus:border-[#2874f0]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bannerForm.active}
                    onChange={(e) => setBannerForm({ ...bannerForm, active: e.target.checked })}
                    className="w-4 h-4 text-[#2874f0] rounded-xs"
                  />
                  <span className="font-bold text-slate-800">Active (Visible on Carousel)</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBannerModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xs hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#2874f0] hover:bg-[#1a5bc4] text-white font-bold rounded-xs shadow-xs transition-colors"
                  >
                    {editingBannerId ? 'Update Banner' : 'Publish Banner'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
