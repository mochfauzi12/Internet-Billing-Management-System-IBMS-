'use client';

import React, { useEffect, useState } from 'react';
import { Wifi, Globe, Zap, Radio, LayoutDashboard, Users, Package, FileText, CreditCard, Bell, BarChart3, Settings, ShieldCheck, LogOut, X } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { getIspSettings, DEFAULT_ISP_SETTINGS, IspSettings } from '@/lib/settings-store';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  currentPath?: string;
}

export function Sidebar({ isOpen, onClose, currentPath = '/dashboard' }: SidebarProps) {
  const [ispSettings, setIspSettings] = useState<IspSettings>(DEFAULT_ISP_SETTINGS);

  useEffect(() => {
    setIspSettings(getIspSettings());
  }, []);

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
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

  const getLogoIcon = () => {
    if (ispSettings.logoType === 'custom' && ispSettings.customLogoUrl) {
      return <img src={ispSettings.customLogoUrl} alt="Logo ISP" className="w-5 h-5 object-contain" />;
    }

    switch (ispSettings.logoType) {
      case 'globe': return <Globe className="w-5 h-5" />;
      case 'zap': return <Zap className="w-5 h-5" />;
      case 'tower': return <Radio className="w-5 h-5" />;
      default: return <Wifi className="w-5 h-5" />;
    }
  };

  const navContent = (
    <div className="h-full flex flex-col justify-between p-4">
      <div>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg text-white shadow-md flex items-center justify-center min-w-[36px] min-h-[36px]">
              {getLogoIcon()}
            </div>
            <div className="overflow-hidden">
              <h1 className="font-extrabold text-gray-900 leading-none truncate max-w-[130px]" title={ispSettings.companyName}>
                {ispSettings.companyName}
              </h1>
              <span className="text-[10px] font-medium text-gray-500 block truncate">Service Provider</span>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href || (item.href === '/dashboard' && currentPath === '/');
            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-bold'
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
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:flex w-60 bg-white border-r border-gray-200 min-h-screen flex-col flex-shrink-0">
        {navContent}
      </aside>

      {/* Mobile / Tablet Off-Canvas Overlay Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs" onClick={onClose} />
          <aside className="relative w-64 max-w-[80vw] bg-white h-full z-10 shadow-2xl flex flex-col">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
