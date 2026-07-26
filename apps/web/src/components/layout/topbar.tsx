import React from 'react';
import { Bell, Menu } from 'lucide-react';

export function Topbar() {
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
          <div>
            <div className="text-sm font-semibold text-gray-900 leading-none">Admin ISP</div>
            <div className="text-xs text-gray-500">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
}
