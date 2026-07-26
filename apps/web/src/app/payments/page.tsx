'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { PaymentFormSheet } from '@/components/modules/payment-form-sheet';
import { MOCK_PAYMENTS, MockPayment } from '@/lib/mock-data';
import { Plus, CreditCard, CheckCircle2 } from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<MockPayment[]>(MOCK_PAYMENTS);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleRecordPayment = (newPayment: any) => {
    const paymentRecord: MockPayment = {
      id: Date.now(),
      ...newPayment,
    };
    setPayments([paymentRecord, ...payments]);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="p-6 space-y-6 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Riwayat Pembayaran</h1>
              <p className="text-sm text-gray-500">Pencatatan dan histori transaksi pembayaran masuk dari pelanggan</p>
            </div>
            <Button variant="primary" className="gap-2" onClick={() => setIsSheetOpen(true)}>
              <Plus className="w-4 h-4" />
              Catat Pembayaran Baru
            </Button>
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
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 text-xs font-medium text-gray-600">{p.paymentDate}</td>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{p.invoiceNumber}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{p.customerName}</td>
                      <td className="px-6 py-4 text-xs">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-medium">
                          <CreditCard className="w-3.5 h-3.5" />
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

      <PaymentFormSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onSubmit={handleRecordPayment}
      />
    </div>
  );
}
