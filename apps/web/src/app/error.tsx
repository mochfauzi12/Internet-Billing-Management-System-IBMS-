'use client';

import React from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-md text-center max-w-md space-y-4">
        <h2 className="text-xl font-bold text-red-600">Terjadi Kesalahan Aplikasi</h2>
        <p className="text-sm text-gray-600">{error.message || 'Gagal memuat halaman.'}</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Coba Muat Ulang
        </button>
      </div>
    </div>
  );
}
