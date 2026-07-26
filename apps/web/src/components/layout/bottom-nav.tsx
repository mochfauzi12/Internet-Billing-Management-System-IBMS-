'use client';

import React from 'react';
import { LayoutDashboard, Users, FileText, CreditCard, Menu } from 'lucide-react';

interface BottomNavProps {
  currentPath?: string;
  onMoreClick: () => void;
}

export function BottomNav({ currentPath = '/dashboard', onMoreClick }: BottomNavProps) {
  const navItems = [
    { label: 'Home', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Pelanggan', icon: Users, href: '/customers' },
    { label: 'Tagihan', icon: FileText, href: '/invoices' },
    { label: 'Bayar', icon: CreditCard, href: '/payments' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.href || (item.href === '/dashboard' && currentPath === '/');
        return (
          <a
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-blue-600 font-bold scale-105' : 'text-gray-500 hover:text-gray-900 font-medium'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] leading-tight">{item.label}</span>
          </a>
        );
      })}

      {/* Menu Drawer Trigger */}
      <button
        onClick={onMoreClick}
        className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-gray-500 hover:text-gray-900 font-medium transition-all"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] leading-tight">Menu</span>
      </button>
    </nav>
  );
}
