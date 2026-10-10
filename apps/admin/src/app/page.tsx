'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'inventory' | 'delivery' | 'share' | 'audit'>('analytics');
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Marketing Share Generator State
  const [shareProduct, setShareProduct] = useState('aura-pro-5g-smartphone');
  const [sharePlatform, setSharePlatform] = useState('instagram');
  const [generatedLink, setGeneratedLink] = useState('http://localhost:4000/s/ig-aura77');

  const orders = [
    { id: 'ORD-L91X-4821', customer: 'Priya Sharma', amount: 69999, status: 'OUT_FOR_DELIVERY', items: 1, date: '10 Mins ago', courier: 'Ramesh Express' },
    { id: 'ORD-L91X-3109', customer: 'Arun Verma', amount: 24999, status: 'PAID', items: 2, date: '25 Mins ago', courier: 'Unassigned' },
    { id: 'ORD-L91X-1944', customer: 'Sneha Patel', amount: 48999, status: 'PACKED', items: 1, date: '1 Hour ago', courier: 'ShopFlow Express' },
    { id: 'ORD-L91X-0822', customer: 'Rahul Iyer', amount: 34999, status: 'DELIVERED', items: 1, date: '3 Hours ago', courier: 'Ramesh Express' },
  ];

  const inventoryAlerts = [
    { sku: 'SF-AURA-PRO-STD', title: 'Aura Pro 5G Flagship', stock: 8, threshold: 10, status: 'LOW_STOCK', supplier: 'Aura Mobiles' },
    { sku: 'SF-ZENITH-TITAN-STD', title: 'Zenith Titan 16" Creator Workstation', stock: 3, threshold: 5, status: 'CRITICAL', supplier: 'Zenith Computing' },
    { sku: 'SF-SONIC-ANC-STD', title: 'SonicWave ANC Hi-Fi', stock: 12, threshold: 15, status: 'REORDER_SOON', supplier: 'Sonic Acoustics' },
    { sku: 'SF-ROBOCLEAN-STD', title: 'RoboClean Lidar Omni', stock: 4, threshold: 10, status: 'LOW_STOCK', supplier: 'RoboSmart Ltd' },
  ];

  const deliveryAgents = [
    { name: 'Ramesh Kumar', vehicle: 'EV Scooter (KA-01-EQ-9988)', activeOrders: 2, rating: 4.95, status: 'ON_ROUTE' },
    { name: 'Vikas Singh', vehicle: 'Motorcycle (KA-05-MK-3312)', activeOrders: 0, rating: 4.88, status: 'AVAILABLE' },
    { name: 'Sanjay Dutt', vehicle: 'EV Cargo (KA-02-EL-7744)', activeOrders: 1, rating: 4.92, status: 'ON_ROUTE' },
  ];

  const auditLogs = [
    { action: 'UPDATE_ORDER_STATUS', user: 'admin@shopflow.io', entity: 'Order ORD-L91X-4821', ip: '103.21.244.1', time: '12 Mins ago' },
    { action: 'CREATE_COUPON', user: 'admin@shopflow.io', entity: 'Coupon SUPERFEST20', ip: '103.21.244.1', time: '1 Hour ago' },
    { action: 'REFRESH_TOKEN_ROTATION', user: 'customer@shopflow.io', entity: 'Session Token', ip: '49.37.112.98', time: '2 Hours ago' },
    { action: 'STOCK_DECREMENT', user: 'system_webhook', entity: 'Product Aura Pro 5G', ip: '52.66.192.4', time: '3 Hours ago' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800/80 bg-slate-900/50 backdrop-blur-xl flex flex-col justify-between p-4">
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-white">ShopFlow</span>
              <span className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Control Center</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Analytics & KPIs</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders Management</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'inventory' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Inventory & Alerts</span>
            </button>

            <button
              onClick={() => setActiveTab('delivery')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'delivery' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Delivery Fleet</span>
            </button>

            <button
              onClick={() => setActiveTab('share')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'share' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Instagram Share Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'audit' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Audit Logs & Security</span>
            </button>
          </nav>
        </div>

        {/* User Badge */}
        <div className="border-t border-slate-800/80 pt-4 px-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-xs border border-indigo-500/30">
              AD
            </div>
            <div>
              <div className="text-xs font-bold text-white">Super Admin</div>
              <div className="text-[10px] text-slate-400">admin@shopflow.io</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Normal" />
        </div>
      </aside>

      {/* Main Dynamic View Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/30 backdrop-blur-md px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-black text-white capitalize">{activeTab} Overview</h1>
            <span className="text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
              Production Monorepo
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
            >
              <span>View Customer Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="text-xs font-semibold text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
              PostgreSQL · Redis · BullMQ
            </div>
          </div>
        </header>

        {/* Tab 1: Real-time Analytics & KPIs */}
        {activeTab === 'analytics' && (
          <div className="p-8 space-y-8 animate-in fade-in duration-150">
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>Gross Sales</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">₹2,480,500</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +18.5% from last month
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-black text-white">1,820</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +12.3% volume
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>Average Order Value</span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white">₹1,362</div>
                <div className="text-xs font-bold text-slate-400">Stable across Indian & Int'l carts</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>Conversion Rate</span>
                  <Users className="w-4 h-4 text-pink-400" />
                </div>
                <div className="text-2xl font-black text-white">3.42%</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +0.6% above benchmark
                </div>
              </div>
            </div>

            {/* Visual Funnel and Acquisition Mix */}
            <div className="grid grid-cols-12 gap-8">
              {/* Funnel */}
              <div className="col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-extrabold text-sm text-white">Checkout Conversion Funnel</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Product Page Views', count: 14200, pct: 100 },
                    { label: 'Added to Cart', count: 4850, pct: 34.1 },
                    { label: 'Reached Checkout', count: 2600, pct: 18.3 },
                    { label: 'Payment Initiated', count: 1950, pct: 13.7 },
                    { label: 'Order Confirmed (Paid)', count: 1820, pct: 12.8 },
                  ].map((step) => (
                    <div key={step.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">{step.label}</span>
                        <span className="text-slate-400">{step.count.toLocaleString()} ({step.pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${step.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Channel Breakdown */}
              <div className="col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-extrabold text-sm text-white">Revenue by Acquisition Channel</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Direct Storefront', rev: '₹1,040,000', share: '42%' },
                    { name: 'Instagram Share Links', rev: '₹694,540', share: '28%' },
                    { name: 'Google Organic Search', rev: '₹446,490', share: '18%' },
                    { name: 'WhatsApp Catalog Shares', rev: '₹299,470', share: '12%' },
                  ].map((ch) => (
                    <div key={ch.name} className="flex items-center justify-between border-b border-slate-800/80 pb-3 last:border-none">
                      <div>
                        <div className="text-xs font-bold text-white">{ch.name}</div>
                        <div className="text-[10px] text-slate-400">UTM Attributed Revenue</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-indigo-400">{ch.rev}</div>
                        <div className="text-[10px] text-slate-400">{ch.share} total</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders Management */}
        {activeTab === 'orders' && (
          <div className="p-8 space-y-6 animate-in fade-in duration-150">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Courier Partner</th>
                    <th className="p-4">Time</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200 font-medium">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-indigo-400">{o.id}</td>
                      <td className="p-4 font-bold text-white">{o.customer}</td>
                      <td className="p-4 font-extrabold">₹{o.amount.toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          o.status === 'OUT_FOR_DELIVERY' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          o.status === 'PAID' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                          o.status === 'PACKED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">{o.courier}</td>
                      <td className="p-4 text-slate-400">{o.date}</td>
                      <td className="p-4 text-right space-x-2">
                        <button className="bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                          Packing Slip
                        </button>
                        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Inventory & Alerts */}
        {activeTab === 'inventory' && (
          <div className="p-8 space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-4 gap-6">
              {inventoryAlerts.map((item) => (
                <div key={item.sku} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] text-slate-400">{item.sku}</span>
                    <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-black px-2 py-0.5 rounded-full">
                      {item.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">Supplier: {item.supplier}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-xs">
                    <span className="text-slate-400">Stock Remaining:</span>
                    <span className="font-black text-amber-400">{item.stock} units</span>
                  </div>
                  <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-xs transition-colors">
                    Reorder Stock (PO)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Delivery Fleet */}
        {activeTab === 'delivery' && (
          <div className="p-8 space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-3 gap-6">
              {deliveryAgents.map((agent) => (
                <div key={agent.name} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                      agent.status === 'ON_ROUTE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {agent.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base text-white">{agent.name}</h4>
                    <p className="text-xs text-slate-400">{agent.vehicle}</p>
                  </div>

                  <div className="border-t border-slate-800 pt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Assigned Parcels:</span>
                      <span className="font-bold text-white">{agent.activeOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Partner Rating:</span>
                      <span className="font-bold text-amber-400">★ {agent.rating}</span>
                    </div>
                  </div>

                  <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-xs shadow-md">
                    Track Live Location (GPS)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Instagram Share Studio */}
        {activeTab === 'share' && (
          <div className="p-8 space-y-6 animate-in fade-in duration-150 max-w-4xl">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6">
              <div>
                <span className="text-xs font-black uppercase text-pink-500 tracking-wider">Social Growth Engine</span>
                <h3 className="text-2xl font-black text-white mt-1">Instagram Share Link & OG Studio</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Generate attribution-tracked short codes (nanoid) + dynamic 1080x1080 & 1080x1920 SVG story cards with automated emojis & tags.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5">Select Product</label>
                  <select
                    value={shareProduct}
                    onChange={(e) => setShareProduct(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-semibold"
                  >
                    <option value="aura-pro-5g-smartphone">Aura Pro 5G Flagship Smartphone</option>
                    <option value="sonicwave-anc-over-ear-headphones">SonicWave ANC Hi-Fi Headphones</option>
                    <option value="chronos-horizon-titanium-smartwatch">Chronos Horizon Titanium Watch</option>
                    <option value="zenith-titan-16-creator-laptop">Zenith Titan 16" Creator Laptop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1.5">Target Social Channel</label>
                  <select
                    value={sharePlatform}
                    onChange={(e) => setSharePlatform(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-semibold"
                  >
                    <option value="instagram">Instagram (Feed & Story Sticker)</option>
                    <option value="whatsapp">WhatsApp Broadcast</option>
                    <option value="twitter">X / Twitter Card</option>
                  </select>
                </div>
              </div>

              {/* Generated Links Box */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Short Attribution Link:</span>
                  <a
                    href="http://localhost:4000/s/ig-aura77"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono font-bold text-pink-400 hover:underline"
                  >
                    http://localhost:4000/s/ig-aura77
                  </a>
                </div>

                {/* Caption Preview */}
                <div className="bg-slate-900 rounded-xl p-4 text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-line border border-slate-800">
                  {`✨ NEW DROP: Aura Pro 5G Flagship ✨\n\nGet yours now for only ₹69,999! 🔥 13% OFF (was ₹79,999)\n\n🛒 Tap link in bio or: http://localhost:4000/s/ig-aura77\n⚡ Limited stock available — Free express shipping today!\n\n#shopflow #flagship #5g #trending #deals`}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`✨ NEW DROP: Aura Pro 5G Flagship ✨\n\nGet yours now for only ₹69,999! 🔥 13% OFF\n\n🛒 Tap link in bio: http://localhost:4000/s/ig-aura77\n\n#shopflow #deals`);
                      setCopiedCaption(true);
                      setTimeout(() => setCopiedCaption(false), 2000);
                    }}
                    className="flex-1 bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors"
                  >
                    {copiedCaption ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCaption ? 'Copied to Clipboard!' : 'Copy Instagram Ready Caption'}</span>
                  </button>

                  <a
                    href="http://localhost:4000/share/og-image/sf-prod-1?format=square1080&discount=13"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 transition-colors"
                  >
                    <span>Download 1080x1080 OG Image</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Audit Logs & Security */}
        {activeTab === 'audit' && (
          <div className="p-8 space-y-6 animate-in fade-in duration-150">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Action</th>
                    <th className="p-4">Operator</th>
                    <th className="p-4">Affected Entity</th>
                    <th className="p-4">IP Address</th>
                    <th className="p-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200 font-medium">
                  {auditLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-indigo-400">{log.action}</td>
                      <td className="p-4 font-semibold text-white">{log.user}</td>
                      <td className="p-4 text-slate-300">{log.entity}</td>
                      <td className="p-4 font-mono text-slate-400">{log.ip}</td>
                      <td className="p-4 text-slate-400 text-right">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
