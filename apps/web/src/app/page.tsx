import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Users, UserCheck, CheckCircle2, XCircle, Wallet, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { label: 'Total Pelanggan', value: '256', sub: 'Semua pelanggan', icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Pelanggan Aktif', value: '240', sub: 'Pelanggan aktif', icon: UserCheck, color: 'bg-green-50 text-green-600' },
    { label: 'Sudah Bayar', value: '180', sub: '75% dari total', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Belum Bayar', value: '60', sub: '25% dari total', icon: XCircle, color: 'bg-amber-50 text-amber-600' },
    { label: 'Pendapatan Bulan Ini', value: 'Rp 45.000.000', sub: '+12% vs bulan lalu', icon: Wallet, color: 'bg-sky-50 text-sky-600' },
    { label: 'Pendapatan Tahun Ini', value: 'Rp 540.000.000', sub: '+18% vs tahun lalu', icon: TrendingUp, color: 'bg-indigo-50 text-indigo-600' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6 space-y-6 flex-1">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Ringkasan informasi bisnis Internet Billing Management System</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">{item.value}</div>
                    <div className="text-xs font-medium text-gray-500">{item.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[300px] flex items-center justify-center text-gray-400">
            [ Area Grafik Pendapatan & Pelanggan Aktif ]
          </div>
        </main>
      </div>
    </div>
  );
}
