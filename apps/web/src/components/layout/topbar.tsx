'use client';

import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const handleLogout = async () => {
    try {
      await apiClient.logout();
    } catch (e) {
      // ignore
    }
    window.location.href = '/login';
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between lg:justify-end sticky top-0 z-30">
      {/* Brand logo shown on Desktop, hidden on Mobile/Tablet */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Empty left spacer on desktop layout */}
      </div>

      {/* Topbar Right Action Bar */}
      <div className="flex items-center justify-between w-full lg:w-auto gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 text-base sm:text-lg lg:hidden">NetISP</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="flex items-center gap-2 sm:gap-3 border-l border-gray-200 pl-2 sm:pl-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
              A
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-sm font-semibold text-gray-900 leading-none">Admin ISP</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
            <button
              onClick={handleLogout}
              className="ml-1 sm:ml-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Keluar / Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
