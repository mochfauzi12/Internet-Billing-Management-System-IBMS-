'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { MOCK_INVOICES } from '@/lib/mock-data';
import { Wifi, Globe, Zap, Radio, Send, Printer, ArrowLeft, CheckCircle2, AlertCircle, CreditCard, Building2 } from 'lucide-react';
import { WhatsAppPreviewModal } from '@/components/modules/whatsapp-preview-modal';
import { getIspSettings, DEFAULT_ISP_SETTINGS, IspSettings } from '@/lib/settings-store';

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const targetId = Number(params.id) || 1;
  const initialInvoice = MOCK_INVOICES.find((inv) => inv.id === targetId) || MOCK_INVOICES[1];

  const [invoice, setInvoice] = useState(initialInvoice);
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);

  // Dynamic ISP Profile & Bank Settings State
  const [ispSettings, setIspSettings] = useState<IspSettings>(DEFAULT_ISP_SETTINGS);

  useEffect(() => {
    setIspSettings(getIspSettings());
  }, []);

  const isPaid = invoice.status === 'LUNAS';

  const handleMarkAsPaid = () => {
    setInvoice({
      ...invoice,
      status: 'LUNAS',
      paidAt: new Date().toISOString().slice(0, 10),
    });
    alert(`Status invoice ${invoice.invoiceNumber} berhasil diubah menjadi LUNAS!`);
  };

  const getLogoIcon = () => {
    switch (ispSettings.logoType) {
      case 'globe': return <Globe className="w-6 h-6" />;
      case 'zap': return <Zap className="w-6 h-6" />;
      case 'tower': return <Radio className="w-6 h-6" />;
      default: return <Wifi className="w-6 h-6" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentPath="/invoices" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 sm:p-6 space-y-6 flex-1 max-w-4xl mx-auto w-full pb-20 lg:pb-6">
          {/* Top navigation & action bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <a href="/invoices" className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Tagihan
            </a>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="gap-2 text-xs" onClick={() => window.print()}>
                <Printer className="w-4 h-4 text-gray-600" /> Cetak / Export PDF
              </Button>

              {!isPaid ? (
                <>
                  <Button variant="success" className="gap-2 text-xs" onClick={() => setIsWaModalOpen(true)}>
                    <Send className="w-4 h-4" /> Kirim WA Penagihan
                  </Button>
                  <Button variant="primary" className="gap-2 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={handleMarkAsPaid}>
                    <CheckCircle2 className="w-4 h-4" /> Tandai Lunas
                  </Button>
                </>
              ) : (
                <Button variant="outline" className="gap-2 text-xs border-emerald-200 bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Invoice Terverifikasi LUNAS
                </Button>
              )}
            </div>
          </div>

          {/* Printable Invoice Card */}
          <div className="bg-white p-6 sm:p-10 md:p-12 rounded-2xl border border-gray-200 shadow-xl space-y-8 print:border-none print:shadow-none print:p-0">
            {/* Header Brand & Document Title (CUSTOMIZABLE VIA SETTINGS) */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b border-gray-200 pb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-md">
                  {getLogoIcon()}
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-gray-900">{ispSettings.companyName}</h1>
                  <p className="text-xs font-semibold text-gray-500">{ispSettings.legalName}</p>
                  <p className="text-xs text-gray-400">{ispSettings.companyAddress} • CS WA: {ispSettings.companyPhone}</p>
                </div>
              </div>

              {/* Dynamic Header Document Title: Penagihan vs Kwitansi Lunas */}
              <div className="text-left sm:text-right space-y-1">
                <h2 className={`text-xl sm:text-2xl font-black tracking-wider ${isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {isPaid ? 'KWITANSI PEMBAYARAN' : 'INVOICE PENAGIHAN'}
                </h2>
                <div className="font-mono text-sm font-bold text-gray-800">{invoice.invoiceNumber}</div>
                <div className="mt-1">
                  <StatusBadge status={invoice.status} />
                </div>
              </div>
            </div>

            {/* Info ISP & Customer Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-1.5 bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Tagihan Ditujukan Kepada:</span>
                <div className="font-extrabold text-gray-900 text-base">{invoice.customerName}</div>
                <div className="text-gray-600 text-xs font-mono font-medium">{invoice.customerPhone}</div>
                <div className="text-gray-500 text-xs mt-1">Jl. Merdeka No. 12, Bandung, Jawa Barat</div>
              </div>

              <div className="space-y-2 bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Tanggal Invoice:</span>
                  <span className="font-bold text-gray-900">01 {invoice.period}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Jatuh Tempo:</span>
                  <span className="font-bold text-red-600">{invoice.dueDate}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Periode Layanan:</span>
                  <span className="font-bold text-blue-600">{invoice.period}</span>
                </div>
                {isPaid && (
                  <div className="flex justify-between text-xs pt-1 border-t border-gray-200">
                    <span className="text-emerald-700 font-bold">Tanggal Lunas:</span>
                    <span className="font-extrabold text-emerald-700">{invoice.paidAt || '05 Mei 2024'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Item Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3.5">Deskripsi Paket Layanan</th>
                    <th className="px-6 py-3.5 text-center">Bandwidth</th>
                    <th className="px-6 py-3.5 text-right">Harga Layanan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{invoice.packageName}</div>
                      <div className="text-xs text-gray-400">Layanan Internet Unlimited Bulanan Periode {invoice.period}</div>
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-bold text-blue-600">20 Mbps Unlimited</td>
                    <td className="px-6 py-4 text-right font-extrabold text-gray-900">Rp {invoice.total.toLocaleString('id-ID')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Calculation */}
            <div className="flex flex-col items-end space-y-2 pt-2 border-t border-gray-100">
              <div className="flex justify-between w-64 text-sm text-gray-600">
                <span>Subtotal Layanan:</span>
                <span>Rp {invoice.total.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between w-64 text-sm text-gray-600">
                <span>Biaya Admin / PPN:</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between w-64 text-lg font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>TOTAL {isPaid ? 'DIBAYAR' : 'TAGIHAN'}:</span>
                <span className={isPaid ? 'text-emerald-600' : 'text-blue-600'}>Rp {invoice.total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Dynamic Status Banner & CUSTOM BANK ACCOUNTS INTEGRATION */}
            {isPaid ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-emerald-900 text-sm">STATUS: LUNAS (PAID)</div>
                    <div className="text-emerald-700">Pembayaran telah diterima dan terverifikasi pada {invoice.paidAt || '05 Mei 2024'}.</div>
                  </div>
                </div>
                <div className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg font-black tracking-widest text-sm shadow-xs self-end sm:self-auto">
                  LUNAS
                </div>
              </div>
            ) : (
              <div className="p-5 bg-amber-50/90 border border-amber-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2.5 text-amber-900 font-extrabold text-sm">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span>INSTRUKSI PEMBAYARAN PENAGIHAN (BELUM BAYAR)</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Mohon lakukan pembayaran sebelum jatuh tempo (<span className="font-bold">{invoice.dueDate}</span>) melalui transfer bank atau QRIS resmi {ispSettings.companyName}:
                </p>

                {/* DYNAMIC BANK ACCOUNTS FROM SETTINGS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-amber-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-gray-800">
                      <Building2 className="w-4 h-4 text-blue-600" /> Bank BCA
                    </div>
                    <div className="font-mono font-extrabold text-blue-700 text-sm">{ispSettings.bcaAccount}</div>
                    <div className="text-[11px] text-gray-500">a.n {ispSettings.bcaName}</div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-amber-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-gray-800">
                      <CreditCard className="w-4 h-4 text-indigo-600" /> Bank Mandiri / QRIS
                    </div>
                    <div className="font-mono font-extrabold text-indigo-700 text-sm">{ispSettings.mandiriAccount}</div>
                    <div className="text-[11px] text-gray-500">a.n {ispSettings.mandiriName}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-6 border-t border-gray-100 text-xs text-gray-400 font-medium">
              Dokumen ini diterbitkan secara sah oleh sistem billing otomatis {ispSettings.companyName}. Terima kasih telah memilih layanan kami.
            </div>
          </div>
        </main>
      </div>

      <BottomNav currentPath="/invoices" onMoreClick={() => setIsSidebarOpen(true)} />

      {isWaModalOpen && (
        <WhatsAppPreviewModal
          isOpen={isWaModalOpen}
          onClose={() => setIsWaModalOpen(false)}
          customerName={invoice.customerName}
          customerPhone={invoice.customerPhone}
          period={invoice.period}
          amount={invoice.total}
          onConfirmSend={() => alert(`Pesan WA penagihan invoice ${invoice.invoiceNumber} berhasil dikirim ke ${invoice.customerName}!`)}
        />
      )}
    </div>
  );
}
