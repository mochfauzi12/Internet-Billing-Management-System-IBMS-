'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/ui/badge';
import { MOCK_INVOICES, MockInvoice } from '@/lib/mock-data';
import { Send, MessageSquare } from 'lucide-react';
import { WhatsAppPreviewModal } from '@/components/modules/whatsapp-preview-modal';

export default function PaymentStatusPage() {
  const [activeTab, setActiveTab] = useState('unpaid');

  const unpaidInvoices = MOCK_INVOICES.filter((inv) => inv.status !== 'LUNAS');
  const paidInvoices = MOCK_INVOICES.filter((inv) => inv.status === 'LUNAS');

  const [waTarget, setWaTarget] = useState<MockInvoice | null>(null);

  const tabs = [
    { id: 'unpaid', label: 'Belum Bayar / Menunggak', count: unpaidInvoices.length },
    { id: 'paid', label: 'Sudah Bayar / Lunas', count: paidInvoices.length },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="p-6 space-y-6 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Status Pembayaran Tagihan</h1>
              <p className="text-sm text-gray-500">Filter berdasarkan status pelunasan tagihan bulan berjalan</p>
            </div>
            {activeTab === 'unpaid' && (
              <Button
                variant="success"
                className="gap-2"
                onClick={() => alert('Kirim reminder massal ke 60 pelanggan menunggak via Cloudflare Queue!')}
              >
                <Send className="w-4 h-4" />
                Kirim Reminder ke Semua ({unpaidInvoices.length})
              </Button>
            )}
          </div>

          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === 'unpaid' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">Pelanggan</th>
                      <th className="px-6 py-3.5">Paket</th>
                      <th className="px-6 py-3.5">Periode</th>
                      <th className="px-6 py-3.5">Jatuh Tempo</th>
                      <th className="px-6 py-3.5">Tagihan</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {unpaidInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{inv.customerName}</div>
                          <div className="text-xs text-gray-400">{inv.customerPhone}</div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-700">{inv.packageName}</td>
                        <td className="px-6 py-4 text-xs text-gray-500">{inv.period}</td>
                        <td className="px-6 py-4 text-xs font-semibold text-red-600">{inv.dueDate}</td>
                        <td className="px-6 py-4 font-bold text-gray-900">Rp {inv.total.toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={inv.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="success"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => setWaTarget(inv)}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Kirim Reminder
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'paid' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">Pelanggan</th>
                      <th className="px-6 py-3.5">Paket</th>
                      <th className="px-6 py-3.5">Periode</th>
                      <th className="px-6 py-3.5">Tanggal Lunas</th>
                      <th className="px-6 py-3.5">Nominal Lunas</th>
                      <th className="px-6 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paidInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">{inv.customerName}</td>
                        <td className="px-6 py-4 text-xs text-gray-700">{inv.packageName}</td>
                        <td className="px-6 py-4 text-xs text-gray-500">{inv.period}</td>
                        <td className="px-6 py-4 text-xs font-medium text-emerald-700">{inv.paidAt || '2024-05-05'}</td>
                        <td className="px-6 py-4 font-bold text-gray-900">Rp {inv.total.toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status="LUNAS" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {waTarget && (
        <WhatsAppPreviewModal
          isOpen={!!waTarget}
          onClose={() => setWaTarget(null)}
          customerName={waTarget.customerName}
          customerPhone={waTarget.customerPhone}
          period={waTarget.period}
          amount={waTarget.total}
          onConfirmSend={() => alert(`Pesan penagihan dikirim ke WA ${waTarget.customerName}`)}
        />
      )}
    </div>
  );
}
