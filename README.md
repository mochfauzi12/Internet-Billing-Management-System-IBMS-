🌐 NetISP — Internet Billing Management System (IBMS)
NetISP adalah aplikasi manajemen tagihan dan pembayaran langganan internet ISP (Internet Service Provider) berbasis Cloudflare Edge Native yang dibangun menggunakan prinsip Clean Architecture Monorepo.

Aplikasi ini didesain khusus untuk mengotomatisasi seluruh siklus bisnis tagihan bulanan ISP: pembuatan invoice massal otomatis tiap awal bulan, pencatatan pembayaran instan, penagihan berbasis WhatsApp Reminder otomatis (queue), pencetakan PDF invoice, hingga pengeluaran laporan keuangan dalam format Microsoft Excel (.xlsx).

🛠️ Technology Stack Lengkap
1. Frontend & Mobile PWA (apps/web)
Framework: Next.js 14 (App Router & Server/Client Components).
Bahasa: TypeScript (Full Static Type Safety).
Styling: Vanilla Tailwind CSS v3 (Custom Color Palette & Micro-animations).
Komponen UI & Ikon: Lucide React + Custom UI Components (Modal, Sheet, Badge, Tabs, Confirm Dialog).
Visualisasi Data/Grafik: Recharts (Line Chart Pendapatan & Area Chart Pertumbuhan Pelanggan).
PWA (Progressive Web App): Standalone Manifest + Bottom Navigation Dock Bar ala aplikasi iOS & Android Native.
2. Backend API (apps/api)
Framework Serverless: Hono Framework berjalan di atas Cloudflare Workers Edge Runtime (latensi Ultra-rendah ~10ms global).
Keamanan Password: Web Crypto API (PBKDF2 SHA-256) bawaan W3C Standard.
Ekspor Excel: SheetJS (xlsx) untuk menghasilkan file spreadsheet .xlsx biner nyata langsung dari Worker.
3. Database & Cloudflare Edge Services (packages/db & packages/infrastructure)
Database Utama: Cloudflare D1 (Serverless SQL Database di Edge).
ORM / Query Builder: Drizzle ORM (TypeScript-first ORM).
Object Storage (PDF Invoice): Cloudflare R2 Storage (Penyimpanan file invoice PDF tanpa biaya egress).
Key-Value Cache & Session: Cloudflare KV Namespace (Cache agregasi dashboard & blacklist token JWT saat logout).
4. Otomatisasi & Antrean (Queues & Cron Triggers)
Background Queue: Cloudflare Queues (wa-reminder-queue) untuk pengiriman pesan massal WhatsApp tanpa membebani respon API.
Scheduled Jobs (Cron):
0 17 1 * *: Cron bulanan otomatis setiap tanggal 1 jam 00:00 WIB untuk membuat tagihan baru bagi pelanggan aktif.
0 0 * * *: Cron harian otomatis untuk mengecek tagihan yang lewat jatuh tempo dan mengubah statusnya menjadi TERLAMBAT.
WA Gateway Integration: Integrasi API resmi dengan Fonnte WA Gateway untuk pengiriman WhatsApp Reminder langsung ke HP pelanggan.
🏗️ Arsitektur Monorepo (Clean Architecture)
Proyek ini menggunakan Turborepo + pnpm Workspaces dengan pembagian 5 paket yang terisolasi dan mudah di-maintain:



Internet Billing Management System/
├── apps/
│   ├── api/             # Layer 4: Hono API Worker & Route Controllers
│   └── web/             # Layer 4: Next.js 14 Admin Panel & Mobile PWA
└── packages/
    ├── core/            # Layer 1 & 2: Pure Business Domain Entities, Interfaces & Use Cases
    ├── db/              # Layer 3: Drizzle Schemas & Cloudflare D1 Repositories
    └── infrastructure/  # Layer 3: Cloudflare Services (R2, KV, WA Fonnte, PDF Engine)
🚀 Fitur-Fitur Utama Aplikasi NetISP
Dashboard Eksekutif: 6 Kartu statistik ringkasan bisnis, Grafik Pendapatan Bulanan, Grafik Pelanggan Aktif, serta ringkasan Pelanggan Terbaru & Tagihan Menunggak.
Manajemen Pelanggan (/customers): CRUD data pelanggan, nomor WA, alamat, paket internet, dan pencarian/filter cepat.
Manajemen Paket Internet (/packages): Kelola pilihan tarif bulanan dan kapasitas kecepatan bandwidth.
Billing & Invoice Engine (/invoices): Generator tagihan massal otomatis/manual, pencetakan dokumen Invoice resmi NetISP, dan unduh PDF.
Pencatatan Pembayaran (/payments): Input pembayaran kasir/transfer bank/QRIS yang otomatis mengubah status invoice menjadi LUNAS.
WhatsApp Reminder Blast (/reminders & /payment-status): Penagihan pesan WhatsApp otomatis berbasis antrean (queue).
Laporan & Ekspor Excel (/reports): Analisis pendapatan dan ekspor file .xlsx biner berdasarkan rentang tanggal.
Manajemen Pengguna Admin (/users): Kelola akun staf pengelola ISP dengan perizinan role (Owner, Administrator, Staff Keuangan).
Pengaturan Profile & Rekening (/settings): Ubah nama ISP, alamat kantor, rekening bank tujuan pembayaran, dan Token WhatsApp.
PWA Mobile Native Experience: Navigasi Bottom Dock Bar ala iOS/Android untuk penggunaan nyaman di smartphone.
