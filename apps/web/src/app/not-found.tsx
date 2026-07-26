import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <h1 className="text-4xl font-extrabold text-blue-600">404</h1>
      <h2 className="text-xl font-bold text-gray-900 mt-2">Halaman Tidak Ditemukan</h2>
      <p className="text-sm text-gray-500 mt-1 max-w-sm">
        Halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <a
        href="/dashboard"
        className="mt-6 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-sm"
      >
        Kembali ke Dashboard
      </a>
    </div>
  );
}
