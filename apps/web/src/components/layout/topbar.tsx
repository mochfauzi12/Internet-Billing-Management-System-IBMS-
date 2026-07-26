'use client';

import React from 'react';
import { Bell, Menu, LogOut } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export function Topbar() {
  const handleLogout = async () => {
    try {
      await apiClient.logout();
    } catch (e) {
      // ignore
    }
    window.location.href = '/login';
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
            A
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-gray-900 leading-none">Admin ISP</div>
            <div className="text-xs text-gray-500">Administrator</div>
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Keluar / Logout"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
