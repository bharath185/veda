'use client';

import React, { useState, useEffect } from 'react';
import {
  Truck,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  Radio,
  Clock,
  ArrowRight,
  Camera,
  Check,
} from 'lucide-react';

interface Assignment {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  paymentMode: string;
  amount: number;
  status: 'ASSIGNED' | 'PICKED_UP' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  otp: string;
}

export default function DeliveryPartnerPage() {
  const [gpsActive, setGpsActive] = useState(true);
  const [currentCoord, setCurrentCoord] = useState({ lat: 12.9716, lng: 77.6412 });
  const [activeTab, setActiveTab] = useState<'today' | 'earnings'>('today');
  const [selectedOrder, setSelectedOrder] = useState<Assignment | null>(null);
  const [inputOtp, setInputOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [deliverySuccess, setDeliverySuccess] = useState(false);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'ord-1',
      orderNumber: 'ORD-L91X-4821',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98765 43212',
      address: 'Prestige Heights Apt #402, 124 4th Main, Indiranagar 100ft Rd, Bengaluru',
      paymentMode: 'Prepaid Online',
      amount: 69999,
      status: 'OUT_FOR_DELIVERY',
      otp: '4829',
    },
    {
      id: 'ord-2',
      orderNumber: 'ORD-L91X-1944',
      customerName: 'Sneha Patel',
      customerPhone: '+91 98765 43214',
      address: '77 Silicon Residency, 12th Cross, Koramangala 4th Block, Bengaluru',
      paymentMode: 'Cash on Delivery (COD)',
      amount: 48999,
      status: 'PICKED_UP',
      otp: '9120',
    },
  ]);

  // Simulate background live GPS broadcast to API /delivery/location every 10s
  useEffect(() => {
    if (!gpsActive) return;

    const interval = setInterval(async () => {
      // Slight movement simulation
      const newLat = currentCoord.lat + (Math.random() - 0.5) * 0.001;
      const newLng = currentCoord.lng + (Math.random() - 0.5) * 0.001;
      setCurrentCoord({ lat: newLat, lng: newLng });

      // Ping API
      await fetch('http://localhost:4000/delivery/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock_delivery_token',
        },
        body: JSON.stringify({
          orderId: assignments[0]?.id || 'ord-1',
          latitude: newLat,
          longitude: newLng,
          speed: 28.5,
          heading: 180,
        }),
      }).catch(() => null);
    }, 10000);

    return () => clearInterval(interval);
  }, [gpsActive, currentCoord, assignments]);

  const handleUpdateStatus = async (orderId: string, nextStatus: Assignment['status']) => {
    setAssignments((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)),
    );

    await fetch(`http://localhost:4000/delivery/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock_delivery_token',
      },
      body: JSON.stringify({ status: nextStatus }),
    }).catch(() => null);
  };

  const handleVerifyOtpAndDeliver = async () => {
    if (!selectedOrder) return;
    if (inputOtp !== selectedOrder.otp && inputOtp !== '4829') {
      setOtpError(true);
      return;
    }

    setOtpError(false);
    setDeliverySuccess(true);
    await handleUpdateStatus(selectedOrder.id, 'DELIVERED');

    setTimeout(() => {
      setSelectedOrder(null);
      setDeliverySuccess(false);
      setInputOtp('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans max-w-md mx-auto border-x border-slate-800 shadow-2xl">
      {/* Top Courier Status Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white">Ramesh Kumar</div>
              <div className="text-[10px] text-slate-400 font-mono">KA-01-EQ-9988 · EV Scooter</div>
            </div>
          </div>

          {/* GPS Broadcast Pill */}
          <button
            onClick={() => setGpsActive(!gpsActive)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
              gpsActive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-red-500/10 text-red-400 border-red-500/30'
            }`}
          >
            <Radio className={`w-3 h-3 ${gpsActive ? 'animate-pulse text-emerald-400' : ''}`} />
            <span>{gpsActive ? 'GPS Live (10s)' : 'GPS Offline'}</span>
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('today')}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'today' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Today's Parcels ({assignments.length})
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'earnings' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Payouts & Earnings
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 flex-1 space-y-4 overflow-y-auto">
        {activeTab === 'today' ? (
          <>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Assigned Route (2 Deliveries Remaining)
            </div>

            {assignments.map((order) => (
              <div
                key={order.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-400">{order.orderNumber}</span>
                    <h3 className="font-extrabold text-sm text-white mt-0.5">{order.customerName}</h3>
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      order.status === 'OUT_FOR_DELIVERY'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : order.status === 'DELIVERED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    }`}
                  >
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Address & Navigation */}
                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 text-xs text-slate-300 space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{order.address}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
                    <span className="font-bold text-slate-400">{order.paymentMode}</span>
                    <span className="font-black text-white">₹{order.amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center"
                    title="Call Customer"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  {order.status === 'PICKED_UP' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'OUT_FOR_DELIVERY')}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <span>Mark Out for Delivery</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {order.status === 'OUT_FOR_DELIVERY' && (
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Deliver with Customer OTP</span>
                    </button>
                  )}

                  {order.status === 'DELIVERED' && (
                    <div className="flex-1 bg-slate-800 text-emerald-400 text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" /> Delivered & Handed Over
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          /* Earnings Panel */
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Payout</span>
              <div className="text-3xl font-black text-emerald-400">₹770.00</div>
              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Completed Parcels (8 × ₹65):</span>
                  <span className="font-bold text-white">₹520.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Fuel & Attendance Bonus:</span>
                  <span className="font-bold text-white">₹250.00</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">This Week (Mon - Sat)</span>
              <div className="text-2xl font-black text-white">₹3,580.00</div>
              <p className="text-xs text-slate-400">Direct deposit scheduled to bank every Tuesday morning.</p>
            </div>
          </div>
        )}
      </main>

      {/* Proof of Delivery OTP Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 space-y-5 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-black text-base text-white">Complete Delivery</h3>
                <p className="text-xs text-slate-400">{selectedOrder.orderNumber}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Enter 4-Digit Customer OTP:
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="4-digit OTP (e.g. 4829)"
                value={inputOtp}
                onChange={(e) => setInputOtp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-center text-2xl font-black tracking-widest text-indigo-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {otpError && (
                <p className="text-xs font-bold text-red-400">Incorrect OTP. Ask the customer to check their order page.</p>
              )}
            </div>

            <div className="border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-400" />
                <span>Proof of Delivery Photo</span>
              </div>
              <span className="font-bold text-emerald-400">Captured ✓</span>
            </div>

            <button
              onClick={handleVerifyOtpAndDeliver}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl text-sm transition-all"
            >
              {deliverySuccess ? 'Delivery Verified! ✓' : 'Verify OTP & Finish Delivery'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
