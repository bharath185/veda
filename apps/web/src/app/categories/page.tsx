'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ChevronRight, Award, ShieldCheck, Leaf } from 'lucide-react';
import { DesktopHeader } from '../../components/desktop/DesktopHeader';
import { MobileBottomNav } from '../../components/mobile/MobileBottomNav';
import { ayurvedaCategories } from '../../data/ayurvedaCatalog';

function SearchQueryHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams?.get('q');

  useEffect(() => {
    if (q) {
      router.replace(`/categories/all?q=${encodeURIComponent(q)}`);
    }
  }, [q, router]);

  return null;
}

export default function AllCategoriesPage() {
  return (
    <div className="min-h-screen bg-[#f1f2f4] text-slate-800 font-sans flex flex-col justify-between">
      <Suspense fallback={null}>
        <SearchQueryHandler />
      </Suspense>
      <DesktopHeader />

      <main className="max-w-7xl mx-auto w-full px-2 sm:px-4 py-4 space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-white px-4 py-2.5 rounded-sm shadow-xs border border-slate-200">
          <Link href="/" className="hover:text-[#2874f0]">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-900">All Classical Categories</span>
        </div>

        {/* Header */}
        <div className="bg-[#2874f0] text-white p-6 rounded-sm shadow-sm space-y-2">
          <div className="inline-block bg-[#ffe500] text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-2xs">
            100% Non-Pharma Herbal Medicine Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Explore Classical Ayurveda Formulations
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl font-medium">
            Browse our complete apothecary of Rasayanas, Gold Shilajit resins, 21-day medicated thailams, and single herb churnas.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {ayurvedaCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group bg-white border border-slate-200 hover:border-[#2874f0] rounded-sm p-4 flex flex-col justify-between hover:shadow-md transition-all space-y-3"
            >
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-xs">
                  {cat.icon}
                </div>
                <h2 className="text-sm font-bold text-slate-900 group-hover:text-[#2874f0] leading-snug">
                  {cat.name}
                </h2>
                <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2874f0]">
                <span>{cat.count} Formulations</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
