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
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'inventory' | 'delivery' | 'share' | 'audit'>('analytics');
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Marketing Share Generator State
  const [shareProduct, setShareProduct] = useState('swarna-bhasma-chyawanprash-1kg');
  const [sharePlatform, setSharePlatform] = useState('instagram');
  const [generatedLink, setGeneratedLink] = useState('http://localhost:4000/s/veda-swarna77');

  const orders = [
    { id: 'ORD-VEDA-8421', customer: 'Priya Sharma', amount: 1499, status: 'OUT_FOR_DELIVERY', items: 1, date: '12 Mins ago', courier: 'Ramesh (Eco EV)' },
    { id: 'ORD-VEDA-7319', customer: 'Dr. Anand Joshi', amount: 2598, status: 'PAID', items: 3, date: '28 Mins ago', courier: 'Unassigned' },
    { id: 'ORD-VEDA-6104', customer: 'Sneha Patel', amount: 3797, status: 'PACKED', items: 2, date: '1 Hour ago', courier: 'VedaFlow Express' },
    { id: 'ORD-VEDA-5822', customer: 'Meera Nambiar', amount: 1299, status: 'DELIVERED', items: 1, date: '3 Hours ago', courier: 'Ramesh (Eco EV)' },
  ];

  const inventoryAlerts = [
    { sku: 'VD-SHILAJIT-GOLD', title: 'Pure Himalayan Shilajit Resin 20g', stock: 4, threshold: 10, status: 'CRITICAL', supplier: 'Himalayan High-Altitude Foragers' },
    { sku: 'VD-ASHWA-KSM66', title: 'KSM-66 Organic Ashwagandha 600mg', stock: 8, threshold: 15, status: 'LOW_STOCK', supplier: 'Ixoreal Biomed Extracts' },
    { sku: 'VD-KUMKUMADI-30', title: 'Kashmiri Saffron Kumkumadi Night Oil 30ml', stock: 6, threshold: 12, status: 'LOW_STOCK', supplier: 'Pampore Saffron Cooperatives' },
    { sku: 'VD-SWARNA-1KG', title: 'Swarna Bhasma Amrit Chyawanprash 1kg', stock: 7, threshold: 10, status: 'REORDER_SOON', supplier: 'Kerala Veda Botanical Pharmacy' },
  ];

  const deliveryAgents = [
    { name: 'Ramesh Kumar', vehicle: 'EV Scooter (KA-01-EQ-9988)', activeOrders: 2, rating: 4.96, status: 'ON_ROUTE' },
    { name: 'Vikas Singh', vehicle: 'Eco Bike (KA-05-MK-3312)', activeOrders: 0, rating: 4.88, status: 'AVAILABLE' },
    { name: 'Sanjay Dutt', vehicle: 'EV Cargo (KA-02-EL-7744)', activeOrders: 1, rating: 4.92, status: 'ON_ROUTE' },
  ];

  const auditLogs = [
    { action: 'AYUSH_BATCH_VERIFICATION', user: 'admin@shopflow.io', entity: 'Batch #VD-2026-CHY-09', ip: '103.21.244.1', time: '10 Mins ago' },
    { action: 'UPDATE_ORDER_STATUS', user: 'admin@shopflow.io', entity: 'Order ORD-VEDA-8421', ip: '103.21.244.1', time: '18 Mins ago' },
    { action: 'CREATE_COUPON', user: 'admin@shopflow.io', entity: 'Coupon HERBAL20', ip: '103.21.244.1', time: '1 Hour ago' },
    { action: 'HEAVY_METAL_LAB_TEST_LOG', user: 'admin@shopflow.io', entity: 'Shilajit Resin Lab CoA', ip: '103.21.244.1', time: '2 Hours ago' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-68 border-r border-slate-800/80 bg-slate-900/50 backdrop-blur-xl flex flex-col justify-between p-4">
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Leaf className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-white">VedaFlow</span>
              <span className="block text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest">
                Ayurveda Control Center
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analytics' ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Ayurveda Sales KPIs</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders' ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Remedy Orders</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'inventory' ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Herbal Stock & Raw Botanicals</span>
            </button>

            <button
              onClick={() => setActiveTab('delivery')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'delivery' ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Herbal Courier Fleet</span>
            </button>

            <button
              onClick={() => setActiveTab('share')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'share' ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Instagram Share Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'audit' ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>AYUSH Compliance & Audit</span>
            </button>
          </nav>
        </div>

        {/* User Badge */}
        <div className="border-t border-slate-800/80 pt-4 px-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-xs border border-emerald-500/30">
              VR
            </div>
            <div>
              <div className="text-xs font-bold text-white">Vaidya R. K. Sharma</div>
              <div className="text-[10px] text-emerald-400">Chief Ayurvedic Officer</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="AYUSH Lab Online" />
        </div>
      </aside>

      {/* Main Dynamic View Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/30 backdrop-blur-md px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-black text-white capitalize">{activeTab} Overview</h1>
            <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> AYUSH Certified Platform
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="http://localhost:3005"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-colors"
            >
              <span>View Customer Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="text-xs font-semibold text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
              PostgreSQL · Redis · 100% Non-Pharma
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
                  <span>Gross Herbal Remedies Sold</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">₹1,842,400</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +24.8% wellness reorders
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>Total Herbal Orders</span>
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">2,140</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +16.2% patient prescriptions
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>Average Wellness Order (AOV)</span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white">₹860</div>
                <div className="text-xs font-bold text-slate-400">High repeat rate on Chyawanprash & Shilajit</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>Prescription Conversion</span>
                  <Users className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-2xl font-black text-white">4.18%</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +1.2% higher than standard pharma
                </div>
              </div>
            </div>

            {/* Visual Funnel and Acquisition Mix */}
            <div className="grid grid-cols-12 gap-8">
              {/* Funnel */}
              <div className="col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-extrabold text-sm text-white">Wellness Remedy Conversion Funnel</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Ayurvedic Herb Page Views', count: 18400, pct: 100 },
                    { label: 'Added Formulation to Cart', count: 6200, pct: 33.7 },
                    { label: 'Reached Checkout', count: 3450, pct: 18.8 },
                    { label: 'Payment Initiated (UPI / Cards)', count: 2890, pct: 15.7 },
                    { label: 'Confirmed AYUSH Herbal Orders', count: 2140, pct: 11.6 },
                  ].map((step) => (
                    <div key={step.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">{step.label}</span>
                        <span className="text-slate-400">{step.count.toLocaleString()} ({step.pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${step.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Channel Breakdown */}
              <div className="col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-extrabold text-sm text-white">Revenue by Holistic Channel</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Direct Storefront (VedaFlow)', rev: '₹820,000', share: '44%' },
                    { name: 'Instagram Herbal Story Shares', rev: '₹540,000', share: '29%' },
                    { name: 'Google Natural Wellness Search', rev: '₹310,000', share: '17%' },
                    { name: 'WhatsApp Vaidya Consultations', rev: '₹172,400', share: '10%' },
                  ].map((ch) => (
                    <div key={ch.name} className="flex items-center justify-between border-b border-slate-800/80 pb-3 last:border-none">
                      <div>
                        <div className="text-xs font-bold text-white">{ch.name}</div>
                        <div className="text-[10px] text-slate-400">UTM Attributed Revenue</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-emerald-400">{ch.rev}</div>
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
                      <td className="p-4 font-mono font-bold text-emerald-400">{o.id}</td>
                      <td className="p-4 font-bold text-white">{o.customer}</td>
                      <td className="p-4 font-extrabold">₹{o.amount.toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          o.status === 'OUT_FOR_DELIVERY' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          o.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          o.status === 'PACKED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-teal-500/20 text-teal-400 border border-teal-500/30'
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
                        <button className="bg-emerald-700 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
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
                    <span className="font-black text-amber-400">{item.stock} glass jars</span>
                  </div>
                  <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-xs transition-colors">
                    Reorder Herbs Batch
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
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
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

                  <button className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs shadow-md">
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
                <span className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <Leaf className="w-4 h-4" /> Herbal Growth Engine
                </span>
                <h3 className="text-2xl font-black text-white mt-1">Ayurveda Instagram Share & OG Studio</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Generate attribution-tracked short links + dynamic 1080x1080 & 1080x1920 SVG story cards with classical herbal benefits & AYUSH badges.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5">Select Ayurvedic Remedy</label>
                  <select
                    value={shareProduct}
                    onChange={(e) => setShareProduct(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-semibold"
                  >
                    <option value="swarna-bhasma-chyawanprash-1kg">Swarna Bhasma Amrit Chyawanprash 1kg</option>
                    <option value="pure-himalayan-shilajit-resin-20g">Pure Himalayan Shilajit Resin 20g</option>
                    <option value="ksm66-organic-ashwagandha-capsules">KSM-66 Organic Ashwagandha Extract</option>
                    <option value="kashmiri-saffron-kumkumadi-night-oil">Kashmiri Saffron Kumkumadi Night Oil</option>
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
                    <option value="whatsapp">WhatsApp Health Broadcast</option>
                    <option value="twitter">X / Twitter Wellness Card</option>
                  </select>
                </div>
              </div>

              {/* Generated Links Box */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Short Attribution Link:</span>
                  <a
                    href="http://localhost:4000/s/veda-swarna77"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono font-bold text-emerald-400 hover:underline"
                  >
                    http://localhost:4000/s/veda-swarna77
                  </a>
                </div>

                {/* Caption Preview */}
                <div className="bg-slate-900 rounded-xl p-4 text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-line border border-slate-800">
                  {`🌿 PURE AYURVEDA WELLNESS: Swarna Bhasma Amrit Chyawanprash (1kg) 🌿\n\n100% Authentic, Lab-Tested Classical Formulation.\nAvailable now for only ₹1,499! 🌿 17% OFF (was ₹1,799)\n\n✅ Non-Pharma Herbal Formulation\n✅ AYUSH Premium Certified · Zero Heavy Metals\n✅ Wild Forest Amla & A2 Gir Cow Cultured Ghee\n\n🛒 Tap link in bio: http://localhost:4000/s/veda-swarna77\n⚡ Free Express Delivery on all orders above ₹999!\n\n#ayurveda #holisticwellness #chyawanprash #ojas #pureherbs #ayushcertified`}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`🌿 PURE AYURVEDA WELLNESS: Swarna Bhasma Amrit Chyawanprash (1kg) 🌿\n\n100% Non-Pharma Formulation.\nAvailable now for only ₹1,499! 🌿 17% OFF\n\n🛒 Tap link in bio: http://localhost:4000/s/veda-swarna77\n\n#ayurveda #herbalwellness #pureherbs`);
                      setCopiedCaption(true);
                      setTimeout(() => setCopiedCaption(false), 2000);
                    }}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors"
                  >
                    {copiedCaption ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCaption ? 'Copied to Clipboard!' : 'Copy Instagram Ready Caption'}</span>
                  </button>

                  <a
                    href="http://localhost:4000/share/og-image/vd-prod-1?format=square1080&discount=17"
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
                    <th className="p-4">Regulatory / Action</th>
                    <th className="p-4">Vaidya / Operator</th>
                    <th className="p-4">Affected Formulation</th>
                    <th className="p-4">IP Address</th>
                    <th className="p-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200 font-medium">
                  {auditLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-emerald-400">{log.action}</td>
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
