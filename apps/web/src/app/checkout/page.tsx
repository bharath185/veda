'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  ArrowRight,
  Check,
  Tag,
  Truck,
  Sparkles,
  Lock,
  ChevronRight,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
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
    phone: '9876543210',
    street: '124, 4th Main, Indiranagar 100ft Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
  });

  const [paymentGateway, setPaymentGateway] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showRazorpaySimModal, setShowRazorpaySimModal] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  // Load Razorpay Script dynamically on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!(window as any).Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    if (code === 'WELCOME500') {
      setDiscountApplied(500);
      setErrorMessage('');
    } else if (code === 'HERBAL20' || code === 'AYUSH20') {
      setDiscountApplied(Math.round(getSubtotal() * 0.2));
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid coupon code. Try WELCOME500 or HERBAL20');
    }
  };

  const subtotal = getSubtotal();
  const tax = Math.round((subtotal - discountApplied) * 0.18);
  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountApplied + tax + shipping);

  // Core Order Finalizer
  const finalizeOrder = (orderId: string, paymentId?: string) => {
    const orderRecord = {
      id: orderId,
      orderNumber: orderId,
      customer: shippingAddress.fullName,
      phone: shippingAddress.phone,
      address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postalCode}`,
      amount: finalTotal,
      gateway: paymentGateway,
      paymentId: paymentId || (paymentGateway === 'COD' ? 'PAY-COD-DOORSTEP' : `pay_${Date.now().toString(36)}`),
      status: paymentGateway === 'COD' ? 'ORDER_PLACED' : 'PAID',
      items: items.map((i) => ({
        id: i.id,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    if (typeof window !== 'undefined') {
      try {
        const existing = JSON.parse(localStorage.getItem('shopflow_orders') || '[]');
        localStorage.setItem('shopflow_orders', JSON.stringify([orderRecord, ...existing]));
      } catch {
        // storage fallback
      }
    }

    clearCart();
    router.push(`/orders/${orderId}?status=success`);
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Add products before checkout.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const newOrderId = `OD-VEDA-${Date.now().toString().slice(-7)}`;
    setCreatedOrderId(newOrderId);

    // 1. CASH ON DELIVERY FLOW
    if (paymentGateway === 'COD') {
      setTimeout(() => {
        setIsSubmitting(false);
        finalizeOrder(newOrderId, 'PAY-COD-DOORSTEP');
      }, 800);
      return;
    }

    // 2. RAZORPAY PAYMENT FLOW
    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal,
          currency: 'INR',
          receipt: newOrderId,
          notes: {
            customerName: shippingAddress.fullName,
            customerPhone: shippingAddress.phone,
          },
        }),
      }).catch(() => null);

      let orderData = { id: `order_${Date.now()}`, keyId: 'rzp_test_AyurVedaFlow2026', amount: finalTotal * 100 };
      if (res && res.ok) {
        orderData = await res.json();
      }

      // Check if official Razorpay modal is available in window
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const options = {
          key: orderData.keyId || 'rzp_test_AyurVedaFlow2026',
          amount: orderData.amount,
          currency: 'INR',
          name: 'VedaFlow Ayurveda',
          description: 'Payment for Classical Ayurvedic Formulations',
          image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200',
          order_id: orderData.id.startsWith('order_') ? orderData.id : undefined,
          prefill: {
            name: shippingAddress.fullName,
            contact: shippingAddress.phone,
            email: 'customer@vedaflow.org',
          },
          theme: {
            color: '#2874f0',
          },
          handler: function (response: any) {
            setIsSubmitting(false);
            finalizeOrder(newOrderId, response.razorpay_payment_id || `pay_${Date.now()}`);
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (err: any) {
          setIsSubmitting(false);
          setErrorMessage(err.error?.description || 'Razorpay payment was not completed.');
        });
        rzp.open();
      } else {
        // Fallback simulation modal if external script is blocked or offline
        setIsSubmitting(false);
        setShowRazorpaySimModal(true);
      }
    } catch {
      setIsSubmitting(false);
      setShowRazorpaySimModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f2f4] text-slate-800 font-sans flex flex-col justify-between">
      {/* Flipkart Header */}
      {!isMobile && <DesktopHeader />}

      {/* Mobile Top Header */}
      {isMobile && (
        <header className="bg-[#2874f0] text-white p-3 flex items-center justify-between shadow-sm sticky top-0 z-40">
          <Link href="/" className="flex items-center gap-1 font-black italic text-lg">
            Veda<span className="text-[#ffe500]">Flow</span>
            <span className="text-[9px] bg-[#ffe500] text-[#2874f0] px-1 rounded-xs uppercase ml-1">
              AYUSH
            </span>
          </Link>
          <span className="text-xs font-bold text-blue-100 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> 100% Safe Checkout
          </span>
        </header>
      )}

      {/* Main Checkout Container */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-6 flex-1 w-full">
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-xs font-bold text-red-600 rounded-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Steps 1 & 2 (Address & Razorpay Gateway) (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Step 1: Delivery Address */}
            <div className="bg-white rounded-xs border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-xs bg-[#2874f0] text-white font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                    Delivery Address
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setShippingAddress({
                      fullName: 'Priya Sharma',
                      phone: '9876543210',
                      street: '124, 4th Main, Indiranagar 100ft Road',
                      city: 'Bengaluru',
                      state: 'Karnataka',
                      postalCode: '560038',
                    })
                  }
                  className="text-xs font-bold text-[#2874f0] hover:underline"
                >
                  Use Demo Address
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xs px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Mobile Phone (For OTP/Courier)</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xs px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-bold mb-1">Street Address, House No.</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xs px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xs px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xs px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:border-[#2874f0]"
                  />
                </div>
              </div>

              <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1.5 pt-1">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Express Next-Day Courier Delivery Available for this Address</span>
              </div>
            </div>

            {/* Step 2: Payment Options (Razorpay Priority) */}
            <div className="bg-white rounded-xs border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="w-6 h-6 rounded-xs bg-[#2874f0] text-white font-black text-xs flex items-center justify-center">
                  2
                </span>
                <h2 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                  Payment Options
                </h2>
              </div>

              <div className="space-y-3">
                {/* Razorpay Option */}
                <div
                  onClick={() => setPaymentGateway('RAZORPAY')}
                  className={`p-4 rounded-xs border-2 cursor-pointer transition-all flex items-start justify-between ${
                    paymentGateway === 'RAZORPAY'
                      ? 'border-[#2874f0] bg-blue-50/40 ring-1 ring-[#2874f0]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-[#2874f0] flex items-center justify-center mt-0.5">
                      {paymentGateway === 'RAZORPAY' && <div className="w-2.5 h-2.5 rounded-full bg-[#2874f0]" />}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                        <span>Razorpay Payment Gateway</span>
                        <span className="bg-[#2874f0] text-white text-[9px] font-black px-1.5 py-0.5 rounded-2xs uppercase">
                          RECOMMENDED
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        UPI (GPay, PhonePe, Paytm), Credit / Debit Cards, NetBanking, Wallets
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-0.5 rounded-2xs text-slate-700">
                          ⚡ Instant UPI & 0% Convenience Fee
                        </span>
                        <span className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-0.5 rounded-2xs text-slate-700">
                          🔒 256-Bit SSL Encrypted
                        </span>
                      </div>
                    </div>
                  </div>
                  <CreditCard className="w-6 h-6 text-[#2874f0] shrink-0" />
                </div>

                {/* Cash on Delivery Option */}
                <div
                  onClick={() => setPaymentGateway('COD')}
                  className={`p-4 rounded-xs border-2 cursor-pointer transition-all flex items-start justify-between ${
                    paymentGateway === 'COD'
                      ? 'border-[#2874f0] bg-blue-50/40 ring-1 ring-[#2874f0]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-400 flex items-center justify-center mt-0.5">
                      {paymentGateway === 'COD' && <div className="w-2.5 h-2.5 rounded-full bg-[#2874f0]" />}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Cash on Delivery (COD)</div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Pay with cash or UPI QR scan when your Ayurvedic remedies arrive at your doorstep.
                      </p>
                    </div>
                  </div>
                  <Banknote className="w-6 h-6 text-slate-500 shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary & Coupon (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sticky top-20">
            {/* Items Summary */}
            <div className="bg-white rounded-xs border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                  Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h3>
                <Link href="/categories" className="text-xs font-bold text-[#2874f0] hover:underline">
                  + Add More
                </Link>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-slate-100">
                {items.map((i) => (
                  <div key={i.variantId} className="pt-2.5 first:pt-0 flex gap-3 text-xs items-center">
                    <img
                      src={i.image}
                      alt={i.title}
                      className="w-14 h-14 rounded-xs object-cover border border-slate-200 bg-white shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 truncate">{i.title}</div>
                      <div className="text-[11px] text-slate-500">Qty: {i.quantity}</div>
                      <div className="text-[10px] text-slate-400 font-mono">SKU: {i.sku}</div>
                    </div>
                    <span className="font-black text-slate-900 shrink-0">
                      ₹{(i.price * i.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Bar */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <label className="block text-[11px] font-bold text-slate-600 uppercase">Apply Ayurvedic Voucher</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="E.g. WELCOME500 or HERBAL20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xs px-3 py-2 text-xs uppercase font-bold focus:outline-none focus:border-[#2874f0]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-[#2874f0] hover:bg-[#1a5bc4] text-white px-4 py-2 rounded-xs text-xs font-black uppercase transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {discountApplied > 0 && (
                  <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 p-2 rounded-xs border border-emerald-200">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Coupon applied! Saved ₹{discountApplied.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              {/* Price Details Breakdown */}
              <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
                <div className="font-black text-slate-700 uppercase tracking-wider text-[11px]">
                  Price Details
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Price ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                  <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountApplied > 0 && (
                  <div className="flex justify-between text-[#388e3c] font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{discountApplied.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charges</span>
                  <span className="font-bold text-[#388e3c]">FREE</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>AYUSH Batch & NABL Lab Screen</span>
                  <span className="font-bold text-[#388e3c]">FREE</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Payable</span>
                  <span className="text-[#2874f0]">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Flipkart Iconic Orange CTA Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || items.length === 0}
                className="w-full bg-[#fb641b] hover:bg-[#e85a14] active:scale-[0.99] text-white font-black py-4 rounded-xs text-sm uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      {paymentGateway === 'RAZORPAY'
                        ? `Pay with Razorpay (₹${finalTotal.toLocaleString('en-IN')})`
                        : `Place COD Order (₹${finalTotal.toLocaleString('en-IN')})`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Safe and Secure Payments · 100% Authentic Classical Ayurveda</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Razorpay Interactive Test Simulation Modal (Ensures 100% Seamless Sandbox Demo) */}
      {showRazorpaySimModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-[#2874f0] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm uppercase tracking-wide">Razorpay Standard Checkout</h3>
                <p className="text-[11px] text-blue-100">VedaFlow Ayurveda Store · Gateway Simulation</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-black">₹{finalTotal.toLocaleString('en-IN')}</div>
                <span className="text-[9px] bg-[#ffe500] text-[#2874f0] font-black px-1 rounded-2xs">TEST MODE</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xs text-slate-700 space-y-1">
                <div className="font-bold text-[#2874f0]">Testing Razorpay Integration:</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Choose a simulated payment channel below to verify order recording, cart clearance, and invoice receipt generation.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowRazorpaySimModal(false);
                    finalizeOrder(createdOrderId || `OD-VEDA-${Date.now().toString().slice(-7)}`, `pay_rzp_upi_${Date.now()}`);
                  }}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-300 p-3 rounded-xs flex items-center justify-between text-left transition-colors font-bold text-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">📱</span>
                    <div>
                      <div>Instant UPI (Google Pay / PhonePe)</div>
                      <div className="text-[10px] text-emerald-600">Simulate 100% Successful Auth</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowRazorpaySimModal(false);
                    finalizeOrder(createdOrderId || `OD-VEDA-${Date.now().toString().slice(-7)}`, `pay_rzp_card_${Date.now()}`);
                  }}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-300 p-3 rounded-xs flex items-center justify-between text-left transition-colors font-bold text-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">💳</span>
                    <div>
                      <div>Credit / Debit Card (Visa, RuPay, Master)</div>
                      <div className="text-[10px] text-slate-500">OTP Verified Transaction</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowRazorpaySimModal(false);
                    finalizeOrder(createdOrderId || `OD-VEDA-${Date.now().toString().slice(-7)}`, `pay_rzp_nb_${Date.now()}`);
                  }}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-300 p-3 rounded-xs flex items-center justify-between text-left transition-colors font-bold text-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏦</span>
                    <div>
                      <div>NetBanking (HDFC, SBI, ICICI, Axis)</div>
                      <div className="text-[10px] text-slate-500">Corporate & Retail Banking</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowRazorpaySimModal(false)}
                  className="text-slate-500 hover:text-slate-700 font-bold px-3 py-1.5"
                >
                  Cancel Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-[11px] text-slate-500">
        © 2026 VedaFlow.com · 100% Genuine Ayurvedic Medicines & Classical Formulations · Razorpay Enabled
      </footer>

      {isMobile && <MobileBottomNav />}
    </div>
  );
}
