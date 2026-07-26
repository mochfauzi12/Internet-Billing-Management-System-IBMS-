'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/modules/confirm-dialog';
import { MOCK_INVOICES, MOCK_CUSTOMERS, MockInvoice } from '@/lib/mock-data';
import { Search, RefreshCw, MessageSquare, FileText, Calendar } from 'lucide-react';
import { WhatsAppPreviewModal } from '@/components/modules/whatsapp-preview-modal';

export default function InvoicesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [invoices, setInvoices] = useState<MockInvoice[]>(MOCK_INVOICES);
  const [searchTerm, setSearchTerm] = useState('');

  // Free flexible Month & Year selection
  const [monthFilter, setMonthFilter] = useState('Mei');
  const [yearFilter, setYearFilter] = useState('2026');
  const [statusFilter, setStatusFilter] = useState('');

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [waTarget, setWaTarget] = useState<MockInvoice | null>(null);

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Dynamic generate full array of years (2020 through 2035) + allows direct typing
  const yearOptions = Array.from({ length: 16 }, (_, i) => String(2020 + i));

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? inv.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleGenerateInvoices = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Generate invoices for active customers for the exact selected custom period
      const newInvoices: MockInvoice[] = MOCK_CUSTOMERS.filter((c) => c.status === 'Aktif').map((cust, idx) => ({
        id: Date.now() + idx,
        invoiceNumber: `INV-${yearFilter}-${String(months.indexOf(monthFilter) + 1).padStart(2, '0')}-000${idx + 1}`,
        customerName: cust.name,
        customerPhone: cust.phone,
        packageName: cust.packageName,
        period: `${monthFilter} ${yearFilter}`,
        total: cust.packagePrice,
        dueDate: `${yearFilter}-${String(months.indexOf(monthFilter) + 1).padStart(2, '0')}-10`,
        status: idx % 2 === 0 ? 'BELUM BAYAR' : 'TERLAMBAT',
      }));

      setInvoices([...newInvoices, ...invoices]);
      setIsGenerating(false);
      setIsGenerateModalOpen(false);
      alert(`Berhasil membuat ${newInvoices.length} tagihan bulanan baru untuk periode ${monthFilter} ${yearFilter}!`);
    }, 800);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentPath="/invoices" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 sm:p-6 space-y-6 flex-1 pb-20 lg:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tagihan Pelanggan (Invoices)</h1>
              <p className="text-xs sm:text-sm text-gray-500">Kelola dan buat invoice tagihan bulanan bebas untuk pelanggan ISP</p>
            </div>
            <Button
              variant="primary"
              className="gap-2 text-xs"
              onClick={() => setIsGenerateModalOpen(true)}
            >
              <RefreshCw className="w-4 h-4" />
              Generate Tagihan Bulanan ({monthFilter} {yearFilter})
            </Button>
          </div>

          {/* Filter & Toolbar dengan Pilihan Periode Bebas */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Cari invoice / pelanggan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Pilih Periode Bebas:</span>
              </div>

              {/* Pilihan Bulan Bebas */}
              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
              >
                {months.map((m) => (
                  <option key={m} value={m}>Bulan {m}</option>
                ))}
              </select>

              {/* Input & Dropdown Tahun Bebas (User-defined Custom Year) */}
              <div className="flex items-center gap-1">
                <select
                  value={yearOptions.includes(yearFilter) ? yearFilter : 'custom'}
                  onChange={(e) => {
                    if (e.target.value !== 'custom') setYearFilter(e.target.value);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>Tahun {y}</option>
                  ))}
                  <option value="custom">Ketik Tahun Lain...</option>
                </select>

                <input
                  type="number"
                  placeholder="Ketik Tahun..."
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-24 px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  title="Ketik tahun berapa saja secara bebas"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Semua Status</option>
                <option value="LUNAS">LUNAS</option>
                <option value="BELUM BAYAR">BELUM BAYAR</option>
                <option value="TERLAMBAT">TERLAMBAT</option>
              </select>
            </div>
          </div>

          {/* Tabel Invoice */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">No. Invoice</th>
                    <th className="px-6 py-3.5">Pelanggan</th>
                    <th className="px-6 py-3.5">Paket Internet</th>
                    <th className="px-6 py-3.5">Periode</th>
                    <th className="px-6 py-3.5">Total Tagihan</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Aksi & Kirim Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{inv.invoiceNumber}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{inv.customerName}</td>
                      <td className="px-6 py-4 text-xs text-gray-600">{inv.packageName}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-blue-700 bg-blue-50/50 px-2 py-1 rounded-md inline-block my-2">
                        {inv.period}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">Rp {inv.total.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Button Cetak / Lihat PDF Invoice */}
                          <a
                            href={`/invoices/${inv.id}`}
                            className="p-2 inline-flex items-center gap-1 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200"
                            title="Lihat & Cetak PDF Invoice"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span className="hidden sm:inline">Invoice PDF</span>
                          </a>

                          {/* Button Kirim WA Reminder Invoice (khusus yang belum bayar / terlambat) */}
                          {inv.status !== 'LUNAS' && (
                            <button
                              onClick={() => setWaTarget(inv)}
                              className="p-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200"
                              title="Kirim Invoice via WhatsApp ke Pelanggan"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="hidden sm:inline">Kirim WA</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <BottomNav currentPath="/invoices" onMoreClick={() => setIsSidebarOpen(true)} />

      <ConfirmDialog
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title={`Generate Tagihan Bulanan (${monthFilter} ${yearFilter})`}
        message={`Sistem akan otomatis membuat tagihan untuk semua pelanggan berstatus AKTIF pada periode bebas ${monthFilter} ${yearFilter}. Lanjutkan?`}
        confirmText="Generate Sekarang"
        variant="primary"
        onConfirm={handleGenerateInvoices}
      />

      {waTarget && (
        <WhatsAppPreviewModal
          isOpen={!!waTarget}
          onClose={() => setWaTarget(null)}
          customerName={waTarget.customerName}
          customerPhone={waTarget.customerPhone}
          period={waTarget.period}
          amount={waTarget.total}
          onConfirmSend={() => alert(`Invoice WA telah berhasil dikirimkan ke ${waTarget.customerName} (${waTarget.customerPhone})!`)}
        />
      )}
    </div>
  );
}
