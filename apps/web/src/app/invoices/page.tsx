'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/modules/confirm-dialog';
import { MOCK_INVOICES, MockInvoice } from '@/lib/mock-data';
import { Search, RefreshCw, Eye, Download, MessageSquare } from 'lucide-react';
import { WhatsAppPreviewModal } from '@/components/modules/whatsapp-preview-modal';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<MockInvoice[]>(MOCK_INVOICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('Mei');
  const [yearFilter, setYearFilter] = useState('2024');
  const [statusFilter, setStatusFilter] = useState('');

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [waTarget, setWaTarget] = useState<MockInvoice | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || inv.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? inv.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleGenerateInvoices = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('Berhasil membuat 240 tagihan bulanan untuk periode Mei 2024 via Cloudflare Worker Cron!');
    }, 1200);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="p-6 space-y-6 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tagihan Pelanggan (Invoices)</h1>
              <p className="text-sm text-gray-500">Kelola dan pantau seluruh status invoice tagihan bulanan</p>
            </div>
            <Button
              variant="primary"
              className="gap-2"
              onClick={() => setIsGenerateModalOpen(true)}
            >
              <RefreshCw className="w-4 h-4" />
              Generate Tagihan Bulanan
            </Button>
          </div>

          {/* Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Cari invoice / pelanggan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Mei">Bulan Mei</option>
                <option value="April">Bulan April</option>
                <option value="Maret">Bulan Maret</option>
              </select>

              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="2024">Tahun 2024</option>
                <option value="2023">Tahun 2023</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{inv.invoiceNumber}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{inv.customerName}</td>
                      <td className="px-6 py-4 text-xs text-gray-600">{inv.packageName}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">{inv.period}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">Rp {inv.total.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <a
                          href={`/invoices/${inv.id}`}
                          className="p-1.5 inline-block text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="Lihat Detail Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        {inv.status !== 'LUNAS' && (
                          <button
                            onClick={() => setWaTarget(inv)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                            title="Kirim Reminder WA"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <ConfirmDialog
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Trigger Generate Tagihan Bulanan"
        message="Sistem akan otomatis membuat tagihan untuk semua pelanggan berstatus AKTIF pada periode Mei 2024. Pelanggan yang sudah memiliki tagihan akan di-skip. Lanjutkan?"
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
          onConfirmSend={() => alert(`Reminder WA telah di-push ke Cloudflare Queue untuk ${waTarget.customerName}!`)}
        />
      )}
    </div>
  );
}
