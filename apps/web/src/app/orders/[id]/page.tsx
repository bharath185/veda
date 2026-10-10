'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Truck, Package, Clock, ShieldCheck, MapPin, ArrowLeft } from 'lucide-react';
import { io } from 'socket.io-client';
import { DesktopHeader } from '../../../components/desktop/DesktopHeader';

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const [orderStatus, setOrderStatus] = useState<string>('OUT_FOR_DELIVERY');
  const [deliveryCoord, setDeliveryCoord] = useState<{ lat: number; lng: number }>({
    lat: 12.9716,
    lng: 77.6412,
  });

  const orderId = params.id;
  const deliveryOtp = '4829'; // OTP given to agent on delivery

  useEffect(() => {
    // Connect to WebSocket Gateway
    const socket = io('http://localhost:4000/tracking', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      socket.emit('joinOrderRoom', { orderId });
    });

    socket.on('locationUpdate', (data: { lat: number; lng: number }) => {
      if (data?.lat && data?.lng) {
        setDeliveryCoord({ lat: data.lat, lng: data.lng });
      }
    });

    socket.on('statusUpdate', (data: { status: string }) => {
      if (data?.status) {
        setOrderStatus(data.status);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  const steps = [
    { key: 'PENDING', label: 'Order Placed', desc: 'Received & Queued' },
    { key: 'PAID', label: 'Payment Verified', desc: 'Prepaid / Verified' },
    { key: 'PACKED', label: 'Packed & Dispatched', desc: 'Warehouse Hub' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Agent on Route' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Handed over' },
  ];

  const currentStepIdx = Math.max(
    steps.findIndex((s) => s.key === orderStatus),
    3,
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DesktopHeader />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 flex-1 w-full space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
            Live Courier WebSocket Connected
          </span>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Tracking Live Order</span>
              <h1 className="text-2xl font-black text-slate-900 mt-0.5">{orderId}</h1>
              <p className="text-xs text-slate-500 mt-1">Courier: ShopFlow Express · Est. Delivery in 24 mins</p>
            </div>

            {/* OTP Security Box */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Delivery Passcode</span>
              <div className="text-2xl font-black text-indigo-700 tracking-widest mt-0.5">{deliveryOtp}</div>
              <span className="text-[10px] text-slate-500">Share with agent at your door</span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="grid grid-cols-5 gap-2 relative">
            {steps.map((s, idx) => {
              const isDone = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div key={s.key} className="flex flex-col items-center text-center space-y-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isDone
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                        : 'bg-slate-100 text-slate-400'
                    } ${isCurrent ? 'ring-4 ring-indigo-100' : ''}`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{s.label}</div>
                    <div className="text-[10px] text-slate-400 hidden md:block">{s.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Delivery Map & GPS Simulation */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-400 animate-pulse" />
                <span className="font-bold text-sm">Ramesh (Express Agent) is 1.4 km away</span>
              </div>
              <span className="text-[10px] font-mono bg-white/10 px-2 py-1 rounded">
                GPS: {deliveryCoord.lat.toFixed(4)}, {deliveryCoord.lng.toFixed(4)}
              </span>
            </div>

            {/* Mock Visual Radar Map */}
            <div className="h-44 w-full bg-slate-800/80 rounded-xl border border-slate-700/60 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              <div className="relative flex items-center gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold mt-1 text-indigo-300">Agent Moving</span>
                </div>
                <div className="w-32 border-t-2 border-dashed border-indigo-400/50 relative">
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-400 animate-ping" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold mt-1 text-emerald-300">Your Home</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
