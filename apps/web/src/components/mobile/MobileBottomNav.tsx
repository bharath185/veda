'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, ShoppingCart, Bell, User } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const count = items.reduce((acc, i) => acc + i.quantity, 0);

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Categories', href: '/', icon: Grid },
    { label: 'Notifications', href: '/', icon: Bell },
    { label: 'Account', href: '/login', icon: User },
    { label: 'Cart', href: '/checkout', icon: ShoppingCart, badge: count },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-3 py-1.5 flex items-center justify-around shadow-md">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-3 relative transition-all active:scale-95 ${
              isActive ? 'text-[#2874f0] font-black' : 'text-slate-600 font-bold'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5 stroke-[2.2]" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-[#ffe500] text-[#2874f0] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
