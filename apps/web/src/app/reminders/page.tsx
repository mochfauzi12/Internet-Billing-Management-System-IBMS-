'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Bell, CheckCircle2, Clock, Send } from 'lucide-react';

export default function RemindersPage() {
  const reminderLogs = [
    { id: 1, name: 'Siti Aminah', phone: '082198765432', time: '2024-05-09 10:30', status: 'Terkirim', provider: 'Fonnte WA Gateway' },
    { id: 2, name: 'Ahmad Dahlan', phone: '085712345678', time: '2024-05-09 10:31', status: 'Terkirim', provider: 'Fonnte WA Gateway' },
    { id: 3, name: 'Rian Hidayat', phone: '083811223344', time: '2024-05-09 10:32', status: 'Gagal (No WA Salah)', provider: 'Fonnte WA Gateway' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="p-6 space-y-6 flex-1">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Riwayat WhatsApp Reminder</h1>
            <p className="text-sm text-gray-500">Log pengiriman notifikasi penagihan via Cloudflare Queues & Fonnte Gateway</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">120</div>
                <div className="text-xs text-gray-500">Total Reminder Terkirim Bulan Ini</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-500">Antrean dalam Cloudflare Queue</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-semibold text-gray-900">
              Log Pengiriman Terakhir
            </div>
            <div className="divide-y divide-gray-100">
              {reminderLogs.map((log) => (
                <div key={log.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      WA
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{log.name}</div>
                      <div className="text-xs text-gray-400">{log.phone} • {log.provider}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      log.status.startsWith('Terkirim') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {log.status}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">{log.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
