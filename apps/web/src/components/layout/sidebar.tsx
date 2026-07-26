'use client';

import React from 'react';
import { Wifi, LayoutDashboard, Users, Package, FileText, CreditCard, Bell, BarChart3, Settings, ShieldCheck, LogOut } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

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

  const handleLogout = async () => {
    try {
      await apiClient.logout();
    } catch (e) {
      // ignore
    }
    window.location.href = '/login';
  };

  return (
    <aside className="w-60 bg-white border-r border-gray-200 min-h-screen flex flex-col p-4 justify-between">
      <div>
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 leading-none">NetISP</h1>
            <span className="text-xs text-gray-500">Service Provider</span>
          </div>
        </div>

        <nav className="space-y-1">
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
      </div>

      {/* Admin Profile Card & Logout */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
            A
          </div>
          <div className="leading-tight">
            <div className="text-xs font-bold text-gray-900">Admin ISP</div>
            <div className="text-[10px] text-gray-400">admin@netisp.id</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
