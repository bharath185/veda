'use client';

import { create } from 'zustand';
import {
  AyurvedicProduct,
  HeroBanner,
  AyurvedicCategory,
  allAyurvedicProducts,
  defaultBanners,
  ayurvedaCategories,
  CATALOG_STORAGE_KEY,
  BANNERS_STORAGE_KEY,
  getLiveProducts,
  getLiveBanners,
  saveLiveProducts,
  saveLiveBanners,
} from '../data/ayurvedaCatalog';

interface CatalogState {
  products: AyurvedicProduct[];
  banners: HeroBanner[];
  categories: AyurvedicCategory[];
  isLoaded: boolean;
  init: () => void;
  addProduct: (product: Omit<AyurvedicProduct, 'id'>) => AyurvedicProduct;
  updateProduct: (id: string, updates: Partial<AyurvedicProduct>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;
  addBanner: (banner: Omit<HeroBanner, 'id'>) => HeroBanner;
  updateBanner: (id: string, updates: Partial<HeroBanner>) => void;
  deleteBanner: (id: string) => void;
  toggleBannerActive: (id: string) => void;
  getProductBySlug: (slug: string) => AyurvedicProduct | undefined;
  getProductsByCategory: (categorySlug: string) => AyurvedicProduct[];
  searchProducts: (query: string) => AyurvedicProduct[];
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  products: allAyurvedicProducts,
  banners: defaultBanners,
  categories: ayurvedaCategories,
  isLoaded: false,

  init: () => {
    if (typeof window === 'undefined') return;
    const products = getLiveProducts();
    const banners = getLiveBanners();
    set({ products, banners, isLoaded: true });

    // Sync across tabs
    const handleCatalogChange = () => {
      set({ products: getLiveProducts() });
    };
    const handleBannersChange = () => {
      set({ banners: getLiveBanners() });
    };
    window.addEventListener('vedaflow_catalog_change', handleCatalogChange);
    window.addEventListener('vedaflow_banners_change', handleBannersChange);
    window.addEventListener('storage', (e) => {
      if (e.key === CATALOG_STORAGE_KEY) handleCatalogChange();
      if (e.key === BANNERS_STORAGE_KEY) handleBannersChange();
    });
  },

  addProduct: (prodInput) => {
    const newId = `vd-custom-${Date.now().toString(36)}`;
    const newProduct: AyurvedicProduct = {
      ...prodInput,
      id: newId,
      slug: prodInput.slug || prodInput.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    };
    const updated = [newProduct, ...get().products];
    set({ products: updated });
    saveLiveProducts(updated);
    return newProduct;
  },

  updateProduct: (id, updates) => {
    const updated = get().products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    set({ products: updated });
    saveLiveProducts(updated);
  },

  deleteProduct: (id) => {
    const updated = get().products.filter((p) => p.id !== id);
    set({ products: updated });
    saveLiveProducts(updated);
  },

  toggleProductStock: (id) => {
    const updated = get().products.map((p) => {
      if (p.id === id) {
        const nextInStock = !p.inStock;
        return {
          ...p,
          inStock: nextInStock,
          stock: nextInStock ? (p.stock > 0 ? p.stock : 25) : 0,
        };
      }
      return p;
    });
    set({ products: updated });
    saveLiveProducts(updated);
  },

  addBanner: (bannerInput) => {
    const newId = `ban-${Date.now().toString(36)}`;
    const newBanner: HeroBanner = {
      ...bannerInput,
      id: newId,
      active: bannerInput.active ?? true,
    };
    const updated = [...get().banners, newBanner];
    set({ banners: updated });
    saveLiveBanners(updated);
    return newBanner;
  },

  updateBanner: (id, updates) => {
    const updated = get().banners.map((b) => (b.id === id ? { ...b, ...updates } : b));
    set({ banners: updated });
    saveLiveBanners(updated);
  },

  deleteBanner: (id) => {
    const updated = get().banners.filter((b) => b.id !== id);
    set({ banners: updated });
    saveLiveBanners(updated);
  },

  toggleBannerActive: (id) => {
    const updated = get().banners.map((b) => (b.id === id ? { ...b, active: !b.active } : b));
    set({ banners: updated });
    saveLiveBanners(updated);
  },

  getProductBySlug: (slug) => {
    return get().products.find((p) => p.slug === slug);
  },

  getProductsByCategory: (categorySlug) => {
    return get().products.filter((p) => p.categorySlug === categorySlug);
  },

  searchProducts: (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return get().products;
    return get().products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  },
}));
