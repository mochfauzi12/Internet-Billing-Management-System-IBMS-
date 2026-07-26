'use client';

import React, { useState } from 'react';
import { Wifi, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@netisp.id');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 800);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* Panel Kiri Dekoratif (Dark Navy) */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg">
            <Wifi className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">NetISP</h1>
            <p className="text-xs text-slate-400">Internet Billing Management System</p>
          </div>
        </div>

        <div className="relative z-10 my-auto space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-blue-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" /> Cloudflare Edge Native Stack
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
            Kelola pelanggan dan pembayaran internet lebih mudah, cepat, dan efisien.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Sistem otomatis pembuat tagihan bulanan, pencatatan pembayaran instan, serta integrasi WhatsApp Reminder berbasis queue.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © 2026 NetISP Billing System. Powered by Cloudflare Workers & Pages.
        </div>
      </div>

      {/* Panel Kanan Form Login */}
      <div className="flex flex-col justify-center items-center p-8 md:p-16 bg-gray-50/50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-200 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">Selamat Datang</h2>
            <p className="text-sm text-gray-500">Silakan login untuk mengakses Admin Panel NetISP</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Email Administrator</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@netisp.id"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-gray-700 uppercase">Password</label>
                <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">
                  Lupa password?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 text-xs">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                Ingat saya
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {isLoading ? (
                <span>Memproses Login...</span>
              ) : (
                <>
                  <span>Login ke Admin Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-gray-400">Akun demo prefilled untuk pengujian admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
