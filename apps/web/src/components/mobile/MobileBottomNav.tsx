'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, ShoppingBag, Package, User } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const count = items.reduce((acc, i) => acc + i.quantity, 0);

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Categories', href: '/categories', icon: Grid },
    { label: 'Cart', href: '/checkout', icon: ShoppingBag, badge: count },
    { label: 'Orders', href: '/orders', icon: Package },
    { label: 'Account', href: '/account', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-3 py-2 flex items-center justify-around pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-2 relative transition-all active:scale-90 ${
              isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-indigo-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
