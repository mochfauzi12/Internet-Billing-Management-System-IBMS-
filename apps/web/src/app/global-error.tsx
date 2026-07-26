'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body>
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>Terjadi Kesalahan Global</h2>
          <p>{error.message}</p>
          <button onClick={() => reset()} style={{ padding: '8px 16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '4px' }}>
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  );
}
