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
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'inventory' | 'delivery' | 'share' | 'audit'>('analytics');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Marketing Share Generator State
  const [shareProduct, setShareProduct] = useState('swarna-bhasma-chyawanprash-1kg');
  const [sharePlatform, setSharePlatform] = useState('instagram');

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
    { action: 'UPDATE_ORDER_DISPATCH', user: 'admin@vedaflow.org', entity: 'Order OD-VEDA-8421098 Assigned to Ekart', ip: '103.21.244.1', time: '18 Mins ago' },
    { action: 'COUPON_ACTIVATE_HERBAL20', user: 'admin@vedaflow.org', entity: 'Coupon HERBAL20 (20% Off Rasayanas)', ip: '103.21.244.1', time: '1 Hour ago' },
    { action: 'AYUSH_LICENSE_VERIFICATION', user: 'admin@vedaflow.org', entity: 'License GA/1482 Renewal Validated', ip: '103.21.244.1', time: '2 Hours ago' },
  ];

  const navItems = [
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

      {/* 1. Flipkart Seller Hub Blue & Slate Sidebar (Desktop + Mobile Slide-out Drawer) */}
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
            {/* Hamburger toggle button for Mobile App view */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 rounded-xs md:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-sm sm:text-base font-black text-slate-900 capitalize truncate">
              {activeTab} Overview
            </h1>
            <span className="hidden sm:flex text-[11px] font-bold bg-blue-50 text-[#2874f0] border border-blue-200 px-2 py-0.5 rounded-xs items-center gap-1">
              <Award className="w-3.5 h-3.5" /> AYUSH Certified Platform
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://vedaflow-theta.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#2874f0] hover:bg-blue-50 px-2.5 sm:px-3 py-1.5 rounded-xs border border-blue-200 flex items-center gap-1 transition-colors"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="hidden lg:block text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xs">
              Flipkart Seller Architecture · NABL Verified
            </div>
          </div>
        </header>

        {/* Tab 1: Real-time Analytics & KPIs */}
        {activeTab === 'analytics' && (
          <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            {/* KPI Cards (Flipkart Seller Hub Metric Cards) */}
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
              {/* Funnel */}
              <div className="col-span-12 lg:col-span-7 bg-white border border-slate-200 rounded-sm p-4 sm:p-5 space-y-4 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900">
                  Ayurvedic Remedy Conversion Funnel
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Ayurvedic Medicine Views', count: 18400, pct: 100 },
                    { label: 'Added Classical Remedy to Cart', count: 6200, pct: 33.7 },
                    { label: 'Reached Checkout', count: 3450, pct: 18.8 },
                    { label: 'UPI / Card Payment Initiated', count: 2890, pct: 15.7 },
                    { label: 'Dispatched & Delivered', count: 2140, pct: 11.6 },
                  ].map((step) => (
                    <div key={step.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-700">{step.label}</span>
                        <span className="text-slate-500">{step.count.toLocaleString()} ({step.pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#2874f0] h-full rounded-full" style={{ width: `${step.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Channel Breakdown */}
              <div className="col-span-12 lg:col-span-5 bg-white border border-slate-200 rounded-sm p-4 sm:p-5 space-y-4 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900">
                  Revenue by Acquisition Channel
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'VedaFlow Storefront Direct', rev: '₹82,000', share: '44%' },
                    { name: 'Instagram Herbal Story Attribution', rev: '₹54,000', share: '29%' },
                    { name: 'Natural Wellness Search (SEO)', rev: '₹31,000', share: '17%' },
                    { name: 'Affiliate & Herbal Partnerships', rev: '₹17,400', share: '10%' },
                  ].map((ch) => (
                    <div key={ch.name} className="flex items-center justify-between border-b border-slate-100 pb-2.5 last:border-none">
                      <div>
                        <div className="text-xs font-bold text-slate-800">{ch.name}</div>
                        <div className="text-[10px] text-slate-400">Attributed GMV</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-slate-900">{ch.rev}</div>
                        <div className="text-[10px] text-[#388e3c] font-bold">{ch.share}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders & Dispatch */}
        {activeTab === 'orders' && (
          <div className="p-3 sm:p-6 space-y-4">
            <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-xs">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs min-w-[640px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Pincode</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Logistics Partner</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#2874f0]">{o.id}</td>
                        <td className="p-3 font-bold text-slate-900">{o.customer}</td>
                        <td className="p-3 font-black">₹{o.amount.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-slate-600">{o.pin}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-2xs text-[10px] font-black uppercase ${
                            o.status === 'OUT_FOR_DELIVERY' ? 'bg-amber-100 text-amber-800' :
                            o.status === 'PAID' ? 'bg-blue-100 text-blue-800' :
                            o.status === 'PACKED' ? 'bg-purple-100 text-purple-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {o.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600">{o.courier}</td>
                        <td className="p-3 text-right space-x-1">
                          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-xs text-[10px] font-bold">
                            Slip
                          </button>
                          <button className="bg-[#2874f0] hover:bg-[#1a5bc4] text-white px-2.5 py-1 rounded-xs text-[10px] font-bold">
                            Dispatch
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Inventory & NABL Lab Reports */}
        {activeTab === 'inventory' && (
          <div className="p-3 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {inventoryAlerts.map((item) => (
                <div key={item.sku} className="bg-white border border-slate-200 rounded-sm p-4 space-y-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] text-slate-400">{item.sku}</span>
                    <span className="bg-red-100 text-red-700 text-[9px] font-black px-1.5 py-0.5 rounded-2xs">
                      {item.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Supplier: {item.supplier}</p>
                    <p className="text-[10px] font-mono text-emerald-700 font-bold mt-0.5">NABL: {item.batch}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between text-xs">
                    <span className="text-slate-500">Stock Remaining:</span>
                    <span className="font-black text-amber-600">{item.stock} glass jars</span>
                  </div>
                  <button className="w-full bg-[#2874f0] hover:bg-[#1a5bc4] text-white font-bold py-1.5 rounded-xs text-xs transition-colors">
                    Reorder Botanicals
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Logistics & Delivery Fleet */}
        {activeTab === 'delivery' && (
          <div className="p-3 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {deliveryAgents.map((agent) => (
                <div key={agent.name} className="bg-white border border-slate-200 rounded-sm p-4 space-y-3 shadow-xs">
                  <div className="flex justify-between items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center font-bold">
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-2xs bg-emerald-100 text-emerald-800">
                      {agent.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{agent.name}</h4>
                    <p className="text-xs text-slate-500">{agent.vehicle}</p>
                    <p className="text-[10px] text-slate-400">{agent.hub}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Active Parcels:</span>
                      <span className="font-bold text-slate-900">{agent.activeOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Partner Rating:</span>
                      <span className="font-bold text-amber-600">★ {agent.rating}</span>
                    </div>
                  </div>

                  <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-1.5 rounded-xs text-xs">
                    Live GPS Telemetry
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Instagram & Social Growth Studio */}
        {activeTab === 'share' && (
          <div className="p-3 sm:p-6 space-y-4 max-w-4xl">
            <div className="bg-white border border-slate-200 rounded-sm p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-xs">
              <div>
                <span className="text-xs font-black uppercase text-[#2874f0] tracking-wider flex items-center gap-1.5">
                  <Leaf className="w-4 h-4" /> Herbal Growth Studio
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                  Instagram Share & Dynamic OG Image Generator
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Generate attribution-tracked short links + dynamic story captions with classical herbal benefits & AYUSH badges.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Select Ayurvedic Medicine</label>
                  <select
                    value={shareProduct}
                    onChange={(e) => setShareProduct(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xs p-2 text-slate-800 font-semibold"
                  >
                    <option value="swarna-bhasma-chyawanprash-1kg">Swarna Bhasma Amrit Chyawanprash 1kg</option>
                    <option value="pure-himalayan-shilajit-resin-20g">Pure Himalayan Shilajit Resin 20g</option>
                    <option value="ksm66-organic-ashwagandha-capsules">KSM-66 Organic Ashwagandha Extract</option>
                    <option value="kashmiri-saffron-kumkumadi-night-oil">Kashmiri Saffron Kumkumadi Night Oil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Target Channel</label>
                  <select
                    value={sharePlatform}
                    onChange={(e) => setSharePlatform(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xs p-2 text-slate-800 font-semibold"
                  >
                    <option value="instagram">Instagram (Feed & Story Sticker)</option>
                    <option value="whatsapp">WhatsApp Health Broadcast</option>
                    <option value="twitter">X / Twitter Wellness Card</option>
                  </select>
                </div>
              </div>

              {/* Attribution Box */}
              <div className="bg-slate-50 rounded-xs border border-slate-200 p-3 sm:p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold gap-1">
                  <span className="text-slate-600">Attribution Link:</span>
                  <a
                    href="https://vedaflow-theta.vercel.app/products/swarna-bhasma-chyawanprash-1kg"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[#2874f0] hover:underline break-all"
                  >
                    https://vedaflow-theta.vercel.app/products/swarna-bhasma-chyawanprash-1kg
                  </a>
                </div>

                {/* Caption */}
                <div className="bg-white rounded-xs p-3 text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-line border border-slate-200">
                  {`🌿 PURE AYURVEDA WELLNESS: Swarna Bhasma Amrit Chyawanprash (1kg) 🌿\n\n100% Authentic, Lab-Tested Classical Formulation.\nAvailable now for only ₹1,499! 🌿 17% OFF (was ₹1,799)\n\n✅ Non-Pharma Herbal Formulation\n✅ AYUSH Premium Certified · Zero Heavy Metals\n✅ Wild Forest Amla & A2 Gir Cow Cultured Ghee\n\n🛒 Tap link in bio: https://vedaflow-theta.vercel.app\n⚡ Free Express Delivery on all orders above ₹999!\n\n#ayurveda #holisticwellness #chyawanprash #ojas #pureherbs #ayushcertified`}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`🌿 PURE AYURVEDA: Swarna Bhasma Amrit Chyawanprash (1kg) for only ₹1,499! https://vedaflow-theta.vercel.app #ayurveda`);
                      setCopiedCaption(true);
                      setTimeout(() => setCopiedCaption(false), 2000);
                    }}
                    className="flex-1 bg-[#2874f0] hover:bg-[#1a5bc4] text-white font-bold py-2 rounded-xs flex items-center justify-center gap-1.5 text-xs transition-colors"
                  >
                    {copiedCaption ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCaption ? 'Copied to Clipboard!' : 'Copy Instagram Ready Caption'}</span>
                  </button>

                  <a
                    href="https://vedaflow-theta.vercel.app/products/swarna-bhasma-chyawanprash-1kg"
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

      {/* 3. Mobile Bottom Navigation Bar (Visible only on mobile devices) */}
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
    </div>
  );
}
