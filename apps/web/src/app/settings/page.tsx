'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { Building2, CreditCard, Key, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [companyName, setCompanyName] = useState('NetISP Services');
  const [companyAddress, setCompanyAddress] = useState('Jl. Melati No. 123, Cirebon, Jawa Barat');
  const [companyPhone, setCompanyPhone] = useState('0812-3456-7890');
  const [companyEmail, setCompanyEmail] = useState('info@netisp.id');

  const [bcaAccount, setBcaAccount] = useState('1234567890');
  const [bcaName, setBcaName] = useState('ISP NET');
  const [mandiriAccount, setMandiriAccount] = useState('0987654321');
  const [mandiriName, setMandiriName] = useState('ISP NET');

  const [waApiKey, setWaApiKey] = useState('dev-fonnte-key');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentPath="/settings" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 sm:p-6 space-y-6 flex-1 pb-20 lg:pb-6 max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pengaturan Sistem & Profil ISP</h1>
              <p className="text-xs sm:text-sm text-gray-500">Kelola identitas ISP, rekening pembayaran, dan integrasi WhatsApp</p>
            </div>
            {isSaved && (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Pengaturan Berhasil Disimpan
              </div>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Profil ISP */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-blue-600 font-bold border-b border-gray-100 pb-3">
                <Building2 className="w-5 h-5" />
                <h3 className="text-base text-gray-900">Profil & Alamat Perusahaan (Tampil di Invoice)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Nama Perusahaan / ISP *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Nomor WhatsApp Official *</label>
                  <input
                    type="text"
                    required
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Alamat Kantor Lengkap *</label>
                  <textarea
                    rows={2}
                    required
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Rekening Pembayaran */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 font-bold border-b border-gray-100 pb-3">
                <CreditCard className="w-5 h-5" />
                <h3 className="text-base text-gray-900">Rekening Bank Tujuan Pembayaran Pelanggan</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                  <div className="text-xs font-bold text-blue-700">Bank BCA</div>
                  <input
                    type="text"
                    placeholder="No. Rekening BCA"
                    value={bcaAccount}
                    onChange={(e) => setBcaAccount(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Atas Nama"
                    value={bcaName}
                    onChange={(e) => setBcaName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white"
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                  <div className="text-xs font-bold text-amber-700">Bank Mandiri</div>
                  <input
                    type="text"
                    placeholder="No. Rekening Mandiri"
                    value={mandiriAccount}
                    onChange={(e) => setMandiriAccount(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Atas Nama"
                    value={mandiriName}
                    onChange={(e) => setMandiriName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Integrasi WhatsApp API Fonnte */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-purple-600 font-bold border-b border-gray-100 pb-3">
                <Key className="w-5 h-5" />
                <h3 className="text-base text-gray-900">Integrasi API Gateway WhatsApp Fonnte</h3>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase">Fonnte Token / API Key</label>
                <input
                  type="password"
                  value={waApiKey}
                  onChange={(e) => setWaApiKey(e.target.value)}
                  placeholder="Masukkan API Key dari fonnte.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none font-mono"
                />
                <p className="text-xs text-gray-500">
                  Dapatkan Token API gratis di dashboard <a href="https://fonnte.com" target="_blank" className="text-purple-600 underline font-semibold">fonnte.com</a> untuk dapat mengirim WhatsApp Reminder otomatis secara nyata ke HP pelanggan.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" className="gap-2 px-6">
                <Save className="w-4 h-4" />
                Simpan Pengaturan Perubahan
              </Button>
            </div>
          </form>
        </main>
      </div>

      <BottomNav currentPath="/settings" onMoreClick={() => setIsSidebarOpen(true)} />
    </div>
  );
}
