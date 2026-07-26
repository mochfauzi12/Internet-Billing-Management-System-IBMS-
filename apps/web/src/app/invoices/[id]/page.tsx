'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { MOCK_INVOICES } from '@/lib/mock-data';
import { Wifi, Download, Send, Printer, ArrowLeft } from 'lucide-react';

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const invoice = MOCK_INVOICES[0]; // mock invoice detail

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="p-6 space-y-6 flex-1 max-w-4xl mx-auto w-full">
          {/* Top navigation & action bar */}
          <div className="flex items-center justify-between">
            <a href="/invoices" className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Tagihan
            </a>

            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                <Printer className="w-4 h-4" /> Print / PDF
              </Button>
              <Button variant="success" className="gap-2" onClick={() => alert('Kirim invoice via WhatsApp Gateway!')}>
                <Send className="w-4 h-4" /> Kirim WhatsApp
              </Button>
            </div>
          </div>

          {/* Printable Invoice Card */}
          <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-lg space-y-8 print:border-none print:shadow-none">
            {/* Header Brand */}
            <div className="flex justify-between items-start border-b border-gray-200 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-xl text-white">
                  <Wifi className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">NetISP</h1>
                  <p className="text-xs text-gray-500">PT NetISP Network Indonesia</p>
                  <p className="text-xs text-gray-400">Jl. Teknologi No. 100, Bandung • CS: 0812-0000-9999</p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <h2 className="text-2xl font-black text-blue-600 tracking-wider">INVOICE</h2>
                <div className="font-mono text-sm font-bold text-gray-800">{invoice.invoiceNumber}</div>
                <StatusBadge status={invoice.status} className="mt-1" />
              </div>
            </div>

            {/* Info ISP & Customer Grid */}
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Tagihan Kepada:</span>
                <div className="font-bold text-gray-900 text-base">{invoice.customerName}</div>
                <div className="text-gray-600 text-xs font-mono">{invoice.customerPhone}</div>
                <div className="text-gray-500 text-xs mt-1">Jl. Merdeka No. 12, Bandung, Jawa Barat</div>
              </div>

              <div className="space-y-2 text-right">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Tanggal Tagihan:</span>
                  <span className="font-semibold text-gray-900">01 Mei 2024</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Jatuh Tempo:</span>
                  <span className="font-semibold text-gray-900">10 Mei 2024</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Periode Layanan:</span>
                  <span className="font-semibold text-gray-900">{invoice.period}</span>
                </div>
              </div>
            </div>

            {/* Item Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3">Deskripsi Layanan</th>
                    <th className="px-6 py-3 text-center">Kecepatan</th>
                    <th className="px-6 py-3 text-right">Harga</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{invoice.packageName}</div>
                      <div className="text-xs text-gray-400">Layanan Internet Unlimited Bulanan</div>
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-semibold text-blue-600">20 Mbps</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">Rp {invoice.total.toLocaleString('id-ID')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Calculation */}
            <div className="flex flex-col items-end space-y-2 pt-2 border-t border-gray-100">
              <div className="flex justify-between w-64 text-sm text-gray-600">
                <span>Subtotal:</span>
                <span>Rp {invoice.total.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between w-64 text-sm text-gray-600">
                <span>Pajak (PPN 0%):</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between w-64 text-lg font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                <span>TOTAL:</span>
                <span className="text-blue-600">Rp {invoice.total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Status Pembayaran Banner */}
            {invoice.status === 'LUNAS' ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold">STATUS: LUNAS</span> — Pembayaran telah diterima pada {invoice.paidAt}.
                </div>
                <span className="font-mono font-bold">LUNAS</span>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                <span className="font-bold">PENTING:</span> Mohon lakukan pembayaran sebelum tanggal jatuh tempo ({invoice.dueDate}) ke rekening BCA 123-456-7890 a.n PT NetISP Network Indonesia.
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-8 border-t border-gray-100 text-xs text-gray-400">
              Terima kasih telah memilih layanan internet NetISP.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
