'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CreditCard, Banknote, ArrowRight, Check, Tag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useIsMobile } from '../../hooks/useIsMobile';
import { DesktopHeader } from '../../components/desktop/DesktopHeader';
import { MobileBottomNav } from '../../components/mobile/MobileBottomNav';

export default function CheckoutPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { items, getSubtotal, getGrandTotal, clearCart } = useCartStore();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: 'Priya Sharma',
    phone: '+919876543212',
    street: '124, 4th Main, Indiranagar 100ft Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
  });

  const [paymentGateway, setPaymentGateway] = useState<'RAZORPAY' | 'STRIPE' | 'COD'>('RAZORPAY');
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileStep, setMobileStep] = useState<1 | 2 | 3>(1); // Step 1: Address, Step 2: Payment, Step 3: Review

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME500') {
      setDiscountApplied(500);
    } else if (couponCode.toUpperCase() === 'SUPERFEST20') {
      setDiscountApplied(Math.round(getSubtotal() * 0.2));
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:4000/checkout/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock_jwt_token',
        },
        body: JSON.stringify({
          shippingAddressId: 'addr-default-1',
          gateway: paymentGateway,
          couponCode: discountApplied > 0 ? couponCode : undefined,
        }),
      }).catch(() => null);

      let orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
      if (res && res.ok) {
        const data = await res.json();
        orderId = data.orderId || orderId;
      }

      clearCart();
      router.push(`/orders/${orderId}`);
    } catch {
      router.push('/orders/ORD-DEMO-SUCCESS');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = getSubtotal();
  const tax = Math.round((subtotal - discountApplied) * 0.18);
  const shipping = subtotal > 1000 ? 0 : 99;
  const finalTotal = subtotal - discountApplied + tax + shipping;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 md:pb-12">
      {!isMobile && <DesktopHeader />}

      {/* Mobile Flow Stepper */}
      {isMobile && (
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span className={mobileStep >= 1 ? 'text-indigo-600' : ''}>1. Address</span>
            <span className={mobileStep >= 2 ? 'text-indigo-600' : ''}>2. Payment</span>
            <span className={mobileStep >= 3 ? 'text-indigo-600' : ''}>3. Review</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${(mobileStep / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex-1 w-full">
        {/* Desktop Layout: Side-by-Side Cart & Checkout */}
        {!isMobile ? (
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* Left Column: Delivery Address & Payment Choice */}
            <div className="col-span-7 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">1</span>
                  <h2 className="text-base font-black text-slate-900">Delivery Address</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Mobile Phone</label>
                    <input
                      type="text"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-slate-500 font-semibold mb-1">Street Address</label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">City</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">2</span>
                  <h2 className="text-base font-black text-slate-900">Select Payment Method</h2>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentGateway('RAZORPAY')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      paymentGateway === 'RAZORPAY' ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-indigo-600 mb-2" />
                    <div className="text-xs font-bold text-slate-900">Razorpay</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">UPI, Cards, NetBanking</div>
                  </button>

                  <button
                    onClick={() => setPaymentGateway('STRIPE')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      paymentGateway === 'STRIPE' ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 text-indigo-600 mb-2" />
                    <div className="text-xs font-bold text-slate-900">Stripe</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">International Cards</div>
                  </button>

                  <button
                    onClick={() => setPaymentGateway('COD')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      paymentGateway === 'COD' ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-indigo-600 mb-2" />
                    <div className="text-xs font-bold text-slate-900">Cash on Delivery</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Pay at Doorstep</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 sticky top-24">
              <h3 className="font-black text-slate-900 text-base">Order Summary ({items.length} items)</h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((i) => (
                  <div key={i.variantId} className="flex gap-3 text-xs items-center">
                    <img src={i.image} alt={i.title} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 line-clamp-1">{i.title}</div>
                      <div className="text-slate-500">Qty: {i.quantity}</div>
                    </div>
                    <span className="font-bold text-slate-900">₹{(i.price * i.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Bar */}
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon (e.g. WELCOME500)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase font-bold"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Apply
                </button>
              </div>

              {discountApplied > 0 && (
                <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Coupon applied: ₹{discountApplied.toLocaleString('en-IN')} saved!
                </div>
              )}

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountApplied > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount:</span>
                    <span>-₹{discountApplied.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Courier Shipping:</span>
                  <span className="font-bold">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total Due:</span>
                  <span className="text-indigo-600">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting || items.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Securing Transaction...' : `Pay ₹${finalTotal.toLocaleString('en-IN')}`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Mobile Flow: Fullscreen Step-by-Step Question Flow */
          <div className="space-y-6">
            {mobileStep === 1 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm animate-in fade-in">
                <h2 className="font-black text-base text-slate-900">Where should we deliver?</h2>
                <div className="space-y-3 text-xs">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                    />
                    <input
                      type="text"
                      placeholder="PIN Code"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setMobileStep(2)}
                  className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl text-sm"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {mobileStep === 2 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm animate-in fade-in">
                <h2 className="font-black text-base text-slate-900">How would you like to pay?</h2>
                <div className="space-y-2.5">
                  <button
                    onClick={() => setPaymentGateway('RAZORPAY')}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between ${
                      paymentGateway === 'RAZORPAY' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">UPI / QR / Cards (Razorpay)</div>
                      <div className="text-[10px] text-slate-500">Instant approval</div>
                    </div>
                    {paymentGateway === 'RAZORPAY' && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>

                  <button
                    onClick={() => setPaymentGateway('STRIPE')}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between ${
                      paymentGateway === 'STRIPE' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">International Card (Stripe)</div>
                      <div className="text-[10px] text-slate-500">USD & Global Cards</div>
                    </div>
                    {paymentGateway === 'STRIPE' && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>

                  <button
                    onClick={() => setPaymentGateway('COD')}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between ${
                      paymentGateway === 'COD' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">Cash on Delivery</div>
                      <div className="text-[10px] text-slate-500">Pay when arrived</div>
                    </div>
                    {paymentGateway === 'COD' && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setMobileStep(1)}
                    className="w-1/3 bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl text-xs"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setMobileStep(3)}
                    className="w-2/3 bg-indigo-600 text-white font-bold py-3.5 rounded-xl text-xs"
                  >
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {mobileStep === 3 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm animate-in fade-in">
                <h2 className="font-black text-base text-slate-900">Order Summary</h2>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Delivering To:</span>
                    <span className="font-bold text-slate-900">{shippingAddress.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Mode:</span>
                    <span className="font-bold text-indigo-600">{paymentGateway}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-100 font-black text-sm text-slate-900">
                    <span>Total Amount:</span>
                    <span className="text-indigo-600">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl text-sm shadow-md"
                >
                  {isSubmitting ? 'Confirming...' : `Confirm & Pay ₹${finalTotal.toLocaleString('en-IN')}`}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {isMobile && <MobileBottomNav />}
    </div>
  );
}
