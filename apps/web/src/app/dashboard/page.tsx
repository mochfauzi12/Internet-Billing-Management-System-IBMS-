'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { StatusBadge } from '@/components/ui/badge';
import { Users, UserCheck, CheckCircle2, XCircle, Wallet, TrendingUp, ArrowRight } from 'lucide-react';
import { MOCK_CUSTOMERS, MOCK_INVOICES } from '@/lib/mock-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const revenueChartData = [
    { month: 'Jan', revenue: 38 },
    { month: 'Feb', revenue: 40 },
    { month: 'Mar', revenue: 42 },
    { month: 'Apr', revenue: 44 },
    { month: 'Mei', revenue: 45 },
  ];

  const customerChartData = [
    { month: 'Jan', active: 210 },
    { month: 'Feb', active: 220 },
    { month: 'Mar', active: 232 },
    { month: 'Apr', active: 238 },
    { month: 'Mei', active: 240 },
  ];

  const stats = [
    { label: 'Total Pelanggan', value: '256', sub: 'Semua terdaftar', icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Pelanggan Aktif', value: '240', sub: 'Status aktif', icon: UserCheck, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Sudah Bayar', value: '180', sub: '75% bulan ini', icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
    { label: 'Belum Bayar', value: '60', sub: '25% menunggak', icon: XCircle, color: 'bg-amber-50 text-amber-600' },
    { label: 'Pendapatan (Bulan ini)', value: 'Rp 45.000.000', sub: '+12% vs bulan lalu', icon: Wallet, color: 'bg-sky-50 text-sky-600' },
    { label: 'Pendapatan (Tahun ini)', value: 'Rp 540.000.000', sub: '+18% vs 2023', icon: TrendingUp, color: 'bg-indigo-50 text-indigo-600' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentPath="/dashboard" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 sm:p-6 space-y-6 flex-1 pb-20 lg:pb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-500">Ringkasan informasi bisnis dan performa keuangan NetISP</p>
          </div>

          {/* 6 Stat Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center ${item.color}`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-extrabold text-gray-900">{item.value}</div>
                    <div className="text-xs font-semibold text-gray-800 line-clamp-1">{item.label}</div>
                    <div className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">{item.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2 Charts Baris */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Grafik Pendapatan Bulanan</h3>
                  <p className="text-xs text-gray-500">Dalam satuan juta Rupiah (jt)</p>
                </div>
                <select className="text-xs border border-gray-300 rounded-lg px-2.5 py-1 bg-white self-start sm:self-auto">
                  <option>Tahun 2024</option>
                  <option>Tahun 2023</option>
                </select>
              </div>
              <div className="h-56 sm:h-64 w-full flex items-center justify-center">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} unit=" jt" />
                      <Tooltip formatter={(value) => [`Rp ${value} Juta`, 'Pendapatan']} />
                      <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-xs text-gray-400">Memuat Grafik...</div>
                )}
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Grafik Pertumbuhan Pelanggan Aktif</h3>
                  <p className="text-xs text-gray-500">Jumlah pelanggan aktif terdaftar</p>
                </div>
                <select className="text-xs border border-gray-300 rounded-lg px-2.5 py-1 bg-white self-start sm:self-auto">
                  <option>6 Bulan Terakhir</option>
                  <option>1 Tahun Terakhir</option>
                </select>
              </div>
              <div className="h-56 sm:h-64 w-full flex items-center justify-center">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={customerChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => [`${value} Pelanggan`, 'Aktif']} />
                      <Area type="monotone" dataKey="active" stroke="#16A34A" fill="#DCFCE7" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-xs text-gray-400">Memuat Grafik...</div>
                )}
              </div>
            </div>
          </div>

          {/* 2 List Baris */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pelanggan Terbaru */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Pelanggan Terbaru</h3>
                <a href="/customers" className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:underline">
                  Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="divide-y divide-gray-100">
                {MOCK_CUSTOMERS.slice(0, 4).map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs sm:text-sm flex items-center justify-center">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-900">{c.name}</div>
                        <div className="text-[11px] sm:text-xs text-gray-500">{c.packageName}</div>
                      </div>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Tagihan Belum Dibayar */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Tagihan Belum Dibayar</h3>
                <a href="/invoices" className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:underline">
                  Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="divide-y divide-gray-100">
                {MOCK_INVOICES.filter((inv) => inv.status !== 'LUNAS').map((inv) => (
                  <div key={inv.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-900">{inv.customerName}</div>
                      <div className="text-[11px] sm:text-xs text-gray-500">{inv.invoiceNumber} • Periode {inv.period}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-bold text-gray-900">Rp {inv.total.toLocaleString('id-ID')}</div>
                      <StatusBadge status={inv.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <BottomNav currentPath="/dashboard" onMoreClick={() => setIsSidebarOpen(true)} />
    </div>
  );
}
