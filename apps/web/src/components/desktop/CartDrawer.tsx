'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getSubtotal, getGrandTotal } = useCartStore();

  const totalItemCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = getSubtotal();
  const grandTotal = getGrandTotal();

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsOpen(false);
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-out Drawer */}
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200 font-sans">
        {/* Header */}
        <div className="bg-[#2874f0] text-white p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="text-base font-black tracking-tight">
              My Cart ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
            title="Close Cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Banner */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 flex items-center gap-2 text-xs font-bold text-emerald-800">
          <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Free Express Delivery on all Classical Ayurvedic Orders!</span>
        </div>

        {/* Cart Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2874f0]">
              <ShoppingCart className="w-10 h-10 opacity-70" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Your Cart is Empty</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Explore authentic Charaka Samhita formulations, pure Himalayan Shilajit, and classical Rasayanas.
              </p>
            </div>
            <Link
              href="/categories"
              onClick={() => setIsOpen(false)}
              className="bg-[#2874f0] hover:bg-[#1a5bc4] text-white font-black text-xs px-6 py-2.5 rounded-xs uppercase tracking-wider shadow-sm transition-all"
            >
              Shop Ayurvedic Remedies
            </Link>
          </div>
        ) : (
          <>
            {/* Scrollable Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-4 space-y-3">
              {items.map((item) => {
                const itemTotal = item.price * item.quantity;
                return (
                  <div key={item.variantId} className="pt-3 first:pt-0 flex gap-3">
                    {/* Item Thumbnail */}
                    <div className="w-20 h-20 rounded-xs border border-slate-200 p-1 flex items-center justify-center bg-white shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.title} className="max-h-full object-contain" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          SKU: {item.sku}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-black text-slate-900">
                          ₹{itemTotal.toLocaleString('en-IN')}
                        </span>
                        {item.compareAtPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{(item.compareAtPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Controls: Stepper + Remove */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-50">
                        {/* Stepper */}
                        <div className="flex items-center border border-slate-300 rounded-xs overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-black text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="text-xs font-bold text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Details Summary Block */}
            <div className="border-t border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
              <div className="font-black text-slate-700 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200">
                Price Details
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Price ({totalItemCount} items)</span>
                <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                <span className="font-bold text-[#388e3c]">FREE</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Packaging & AYUSH Lab Screen</span>
                <span className="font-bold text-[#388e3c]">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-base text-[#2874f0]">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="p-4 bg-white border-t border-slate-200 flex gap-2 shadow-lg">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-3 rounded-xs text-xs uppercase tracking-wider transition-colors"
              >
                Continue Shopping
              </button>

              <button
                type="button"
                onClick={handleCheckout}
                className="flex-1 bg-[#fb641b] hover:bg-[#e85a14] active:scale-[0.99] text-white font-black py-3 px-3 rounded-xs text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <span>PLACE ORDER</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
