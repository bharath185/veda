'use client';

import { create } from 'zustand';

export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  title: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  getSubtotal: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [
    {
      id: 'demo-1',
      variantId: 'v-1',
      productId: 'vd-prod-1',
      title: 'Swarna Bhasma Amrit Chyawanprash with Wild Forest Amla (1kg)',
      sku: 'VD-CHYAWAN-1KG',
      price: 1499,
      compareAtPrice: 1799,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80',
    },
  ],
  isOpen: false,
  addItem: (newItem) => {
    set((state) => {
      const existing = state.items.find((i) => i.variantId === newItem.variantId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.variantId === newItem.variantId ? { ...i, quantity: i.quantity + newItem.quantity } : i,
          ),
          isOpen: true,
        };
      }
      return { items: [...state.items, newItem], isOpen: true };
    });
  },
  removeItem: (variantId) => {
    set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) }));
  },
  updateQuantity: (variantId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((i) => i.variantId !== variantId) };
      }
      return {
        items: state.items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
      };
    });
  },
  clearCart: () => set({ items: [] }),
  setIsOpen: (isOpen) => set({ isOpen }),
  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
  getGrandTotal: () => {
    const subtotal = get().getSubtotal();
    const tax = Math.round(subtotal * 0.18);
    const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 99;
    return subtotal + tax + shipping;
  },
}));
