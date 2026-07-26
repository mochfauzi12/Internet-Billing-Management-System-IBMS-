'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { Building2, CreditCard, Key, Save, CheckCircle2, Wifi, Globe, Zap, Radio, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { getIspSettings, saveIspSettings, IspSettings } from '@/lib/settings-store';

export default function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [settings, setSettings] = useState<IspSettings>({
    companyName: 'NetISP',
    legalName: 'PT NetISP Network Indonesia',
    companyAddress: 'Jl. Teknologi No. 100, Bandung, Jawa Barat',
    companyPhone: '0812-0000-9999',
    companyEmail: 'info@netisp.id',
    logoType: 'wifi',
    customLogoUrl: '',
    bcaAccount: '123-456-7890',
    bcaName: 'PT NetISP Network Indonesia',
    mandiriAccount: '098-765-4321',
    mandiriName: 'PT NetISP Network Indonesia',
    waApiKey: 'dev-fonnte-key',
  });

  useEffect(() => {
    setSettings(getIspSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveIspSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar berformat PNG, JPG, atau SVG.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSettings({
        ...settings,
        logoType: 'custom',
        customLogoUrl: dataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentPath="/settings" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 sm:p-6 space-y-6 flex-1 pb-20 lg:pb-6 max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pengaturan Sistem & Profil ISP</h1>
              <p className="text-xs sm:text-sm text-gray-500">Kustomisasi logo PNG sendiri, profil ISP, rekening bank, dan integrasi WhatsApp</p>
            </div>
            {isSaved && (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> Pengaturan & Logo PNG Berhasil Disimpan!
              </div>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Profil & Brand ISP */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-blue-600 font-bold border-b border-gray-100 pb-3">
                <Building2 className="w-5 h-5" />
                <h3 className="text-base text-gray-900">Profil, Brand & Logo Custom (Tampil di Invoice & Header)</h3>
              </div>

              {/* Logo Choice & PNG File Upload */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase">Pilih Logo Brand ISP Atau Upload File PNG *</label>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { id: 'wifi', name: 'Wifi Icon', icon: Wifi },
                    { id: 'globe', name: 'Globe Icon', icon: Globe },
                    { id: 'zap', name: 'Zap Lightning', icon: Zap },
                    { id: 'tower', name: 'Radio Tower', icon: Radio },
                  ].map((item) => {
                    const IconComp = item.icon;
                    const isSelected = settings.logoType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSettings({ ...settings, logoType: item.id as any })}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-600/20'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span>{item.name}</span>
                      </button>
                    );
                  })}

                  {/* Option for Custom PNG Upload */}
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('png-file-input');
                      if (input) input.click();
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                      settings.logoType === 'custom'
                        ? 'bg-purple-50 border-purple-600 text-purple-700 ring-2 ring-purple-600/20'
                        : 'bg-white border-dashed border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${settings.logoType === 'custom' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}`}>
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <span>{settings.customLogoUrl ? 'Logo PNG Aktif' : 'Upload PNG'}</span>
                  </button>
                </div>

                {/* File Input Element */}
                <input
                  id="png-file-input"
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Upload Box Dropzone & Preview */}
                <div className="p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {settings.customLogoUrl ? (
                      <div className="w-14 h-14 rounded-xl border border-gray-200 bg-white p-1.5 flex items-center justify-center shadow-xs">
                        <img src={settings.customLogoUrl} alt="Preview Logo ISP" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                        <Upload className="w-6 h-6" />
                      </div>
                    )}

                    <div>
                      <div className="text-xs font-bold text-gray-900">
                        {settings.customLogoUrl ? 'Logo PNG Kustom Terpasang' : 'Upload File Logo Perusahaan (PNG/JPG)'}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Format PNG transparan atau SVG direkomendasikan (Ukuran maks: 2 MB)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="png-file-input"
                      className="px-3.5 py-2 rounded-lg bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors inline-flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-purple-600" />
                      <span>{settings.customLogoUrl ? 'Ganti Logo PNG' : 'Pilih File PNG'}</span>
                    </label>

                    {settings.customLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, logoType: 'wifi', customLogoUrl: '' })}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 border border-red-200"
                        title="Hapus Logo PNG Kustom"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nama Brand / Merk ISP *</label>
                  <input
                    type="text"
                    required
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    placeholder="NetISP"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nama Legal PT / Badan Hukum *</label>
                  <input
                    type="text"
                    required
                    value={settings.legalName}
                    onChange={(e) => setSettings({ ...settings, legalName: e.target.value })}
                    placeholder="PT NetISP Network Indonesia"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nomor CS WhatsApp Official *</label>
                  <input
                    type="text"
                    required
                    value={settings.companyPhone}
                    onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                    placeholder="0812-0000-9999"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Official CS *</label>
                  <input
                    type="email"
                    required
                    value={settings.companyEmail}
                    onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                    placeholder="cs@netisp.id"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Alamat Kantor Lengkap (Tampil di Header Invoice) *</label>
                  <textarea
                    rows={2}
                    required
                    value={settings.companyAddress}
                    onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Rekening Bank Tujuan Pembayaran */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 font-bold border-b border-gray-100 pb-3">
                <CreditCard className="w-5 h-5" />
                <h3 className="text-base text-gray-900">Rekening Bank Tujuan Pembayaran (Otomatis Masuk Invoice Penagihan)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                  <div className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">Rekening Bank 1 (BCA)</div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">No. Rekening BCA</label>
                    <input
                      type="text"
                      placeholder="123-456-7890"
                      value={settings.bcaAccount}
                      onChange={(e) => setSettings({ ...settings, bcaAccount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono font-bold text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Atas Nama (A.N)</label>
                    <input
                      type="text"
                      placeholder="PT NetISP Network Indonesia"
                      value={settings.bcaName}
                      onChange={(e) => setSettings({ ...settings, bcaName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 bg-white"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                  <div className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider">Rekening Bank 2 (Mandiri / BRI / QRIS)</div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">No. Rekening Mandiri / QRIS ID</label>
                    <input
                      type="text"
                      placeholder="098-765-4321"
                      value={settings.mandiriAccount}
                      onChange={(e) => setSettings({ ...settings, mandiriAccount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono font-bold text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Atas Nama (A.N)</label>
                    <input
                      type="text"
                      placeholder="PT NetISP Network Indonesia"
                      value={settings.mandiriName}
                      onChange={(e) => setSettings({ ...settings, mandiriName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Integrasi WhatsApp API Fonnte */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-purple-600 font-bold border-b border-gray-100 pb-3">
                <Key className="w-5 h-5" />
                <h3 className="text-base text-gray-900">Integrasi API Gateway WhatsApp Fonnte</h3>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase">Fonnte Token / API Key</label>
                <input
                  type="password"
                  value={settings.waApiKey}
                  onChange={(e) => setSettings({ ...settings, waApiKey: e.target.value })}
                  placeholder="Masukkan API Key dari fonnte.com"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none font-mono"
                />
                <p className="text-xs text-gray-500">
                  Dapatkan Token API di <a href="https://fonnte.com" target="_blank" className="text-purple-600 underline font-semibold">fonnte.com</a> untuk mengirimkan reminder WhatsApp secara nyata ke HP pelanggan.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" className="gap-2 px-8 py-3 text-sm font-bold shadow-lg shadow-blue-500/25">
                <Save className="w-4 h-4" />
                Simpan & Integrasikan Ke Invoice
              </Button>
            </div>
          </form>
        </main>
      </div>

      <BottomNav currentPath="/settings" onMoreClick={() => setIsSidebarOpen(true)} />
    </div>
  );
}
