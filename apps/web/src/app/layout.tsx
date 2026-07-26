import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'NetISP - Internet Billing Management System',
  description: 'Kelola pelanggan, tagihan, dan pembayaran internet ISP dengan mudah.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NetISP',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body className={`${inter.className} min-h-screen bg-gray-50 text-gray-900 antialiased selection:bg-blue-600 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
