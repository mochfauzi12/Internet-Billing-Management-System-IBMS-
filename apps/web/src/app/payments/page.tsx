'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { PaymentFormSheet } from '@/components/modules/payment-form-sheet';
import { MOCK_PAYMENTS, MockPayment } from '@/lib/mock-data';
import { Plus, CreditCard, FileSpreadsheet, FileText, Search } from 'lucide-react';

export default function PaymentsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [payments, setPayments] = useState<MockPayment[]>(MOCK_PAYMENTS);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRecordPayment = (newPayment: any) => {
    const paymentRecord: MockPayment = {
      id: Date.now(),
      ...newPayment,
    };
    setPayments([paymentRecord, ...payments]);
  };

  const handleExport = (type: 'excel' | 'pdf') => {
    if (type === 'excel') {
      window.open('http://localhost:8787/api/payments/export?type=excel', '_blank');
    } else {
      window.print();
    }
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentPath="/payments" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 sm:p-6 space-y-6 flex-1 pb-20 lg:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Riwayat Pembayaran</h1>
              <p className="text-xs sm:text-sm text-gray-500">Pencatatan dan histori transaksi pembayaran masuk dari pelanggan</p>
            </div>

            {/* Action Buttons: Export Excel, Export PDF, and Record Payment */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                className="gap-2 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                onClick={() => handleExport('excel')}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Export Excel (.xlsx)
              </Button>

              <Button
                variant="outline"
                className="gap-2 text-xs border-red-200 text-red-700 hover:bg-red-50"
                onClick={() => handleExport('pdf')}
              >
                <FileText className="w-4 h-4 text-red-600" />
                Export PDF
              </Button>

              <Button variant="primary" className="gap-2 text-xs" onClick={() => setIsSheetOpen(true)}>
                <Plus className="w-4 h-4" />
                Catat Pembayaran Baru
              </Button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pelanggan, invoice, atau metode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="text-xs text-gray-500 font-medium hidden sm:block">
              Total Transaksi: <span className="font-bold text-gray-900">{filteredPayments.length} Pembayaran</span>
            </div>
          </div>

          {/* Tabel Riwayat Pembayaran */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Tanggal Bayar</th>
                    <th className="px-6 py-3.5">No. Invoice</th>
                    <th className="px-6 py-3.5">Nama Pelanggan</th>
                    <th className="px-6 py-3.5">Metode Bayar</th>
                    <th className="px-6 py-3.5">Nominal Diterima</th>
                    <th className="px-6 py-3.5">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 text-xs font-medium text-gray-600">{p.paymentDate}</td>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{p.invoiceNumber}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{p.customerName}</td>
                      <td className="px-6 py-4 text-xs">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-medium">
                          <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                          {p.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-600">Rp {p.amount.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">{p.note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <BottomNav currentPath="/payments" onMoreClick={() => setIsSidebarOpen(true)} />

      <PaymentFormSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onSubmit={handleRecordPayment}
      />
    </div>
  );
}
