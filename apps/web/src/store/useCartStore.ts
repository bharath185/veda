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
      variantId: 'sf-var-1',
      productId: 'sf-prod-1',
      title: 'Aura Pro 5G Flagship Smartphone',
      sku: 'SF-AURA-PRO-STD',
      price: 69999,
      compareAtPrice: 79999,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
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
