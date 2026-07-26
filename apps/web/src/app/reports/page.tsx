'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Download, FileSpreadsheet, FileText, Wallet, CreditCard, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('revenue');
  const [periodFilter, setPeriodFilter] = useState('monthly');

  const dailyRevenueData = [
    { day: '01', revenue: 1.5 },
    { day: '02', revenue: 2.0 },
    { day: '03', revenue: 3.5 },
    { day: '04', revenue: 4.0 },
    { day: '05', revenue: 8.5 },
    { day: '06', revenue: 5.0 },
    { day: '07', revenue: 4.2 },
    { day: '08', revenue: 6.8 },
    { day: '09', revenue: 3.0 },
    { day: '10', revenue: 6.5 },
  ];

  const tabs = [
    { id: 'revenue', label: 'Laporan Pendapatan' },
    { id: 'customers', label: 'Laporan Pelanggan' },
    { id: 'invoices', label: 'Laporan Tagihan' },
    { id: 'payments', label: 'Laporan Pembayaran' },
  ];

  const handleExport = (type: 'excel' | 'pdf') => {
    if (type === 'excel') {
      alert('Mengekspor laporan dalam format Excel (.xlsx) via SheetJS...');
    } else {
      alert('Mengekspor laporan PDF via Cloudflare Browser Rendering API...');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="p-6 space-y-6 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan & Layanan</h1>
              <p className="text-sm text-gray-500">Analisis dan ekspor data performa bisnis NetISP</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 text-xs" onClick={() => handleExport('excel')}>
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Export Excel
              </Button>
              <Button variant="outline" className="gap-2 text-xs" onClick={() => handleExport('pdf')}>
                <FileText className="w-4 h-4 text-red-600" />
                Export PDF
              </Button>
            </div>
          </div>

          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          {/* Quick Filters */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="flex gap-3">
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="monthly">Bulan Mei 2024</option>
                <option value="last_month">Bulan April 2024</option>
                <option value="yearly">Tahun 2024 (Full)</option>
              </select>
            </div>
            <div className="text-xs text-gray-500 font-medium">Periode: 01 Mei 2024 – 31 Mei 2024</div>
          </div>

          {/* 3 Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900">Rp 45.000.000</div>
              <div className="text-xs font-semibold text-gray-500">Total Pendapatan Terkumpul</div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900">180 Transaksi</div>
              <div className="text-xs font-semibold text-gray-500">Total Transaksi Lunas</div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900">Rp 250.000</div>
              <div className="text-xs font-semibold text-gray-500">Rata-rata Nilai Transaksi (ARPU)</div>
            </div>
          </div>

          {/* Bar Chart Daily Revenue */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Grafik Pendapatan Harian (Mei 2024)</h3>
              <p className="text-xs text-gray-500">Dalam satuan Juta Rupiah (jt)</p>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} label={{ value: 'Tanggal (Mei)', position: 'insideBottom', offset: -5, fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} unit=" jt" />
                  <Tooltip formatter={(val) => [`Rp ${val} Juta`, 'Pendapatan']} />
                  <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
