import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NetISP - Internet Billing Management System',
  description: 'Kelola pelanggan, tagihan, dan pembayaran internet ISP dengan mudah.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
