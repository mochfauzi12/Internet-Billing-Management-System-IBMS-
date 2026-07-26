'use client';

import React from 'react';
import { Wifi, LayoutDashboard, Users, Package, FileText, CreditCard, Bell, BarChart3, Settings, ShieldCheck } from 'lucide-react';

export function Sidebar() {
  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', active: true },
    { label: 'Pelanggan', icon: Users, href: '/customers' },
    { label: 'Paket Internet', icon: Package, href: '/packages' },
    { label: 'Tagihan', icon: FileText, href: '/invoices' },
    { label: 'Pembayaran', icon: CreditCard, href: '/payments' },
    { label: 'Reminder', icon: Bell, href: '/reminders' },
    { label: 'Laporan', icon: BarChart3, href: '/reports' },
    { label: 'Pengguna', icon: ShieldCheck, href: '/users' },
    { label: 'Pengaturan', icon: Settings, href: '/settings' },
  ];

  return (
    <aside className="w-60 bg-white border-r border-gray-200 min-h-screen flex flex-col p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="p-2 bg-blue-600 rounded-lg text-white">
          <Wifi className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-gray-900 leading-none">NetISP</h1>
          <span className="text-xs text-gray-500">Service Provider</span>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
