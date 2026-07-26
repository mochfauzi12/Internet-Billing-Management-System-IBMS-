# PRD — Internet Billing Management System (IBMS)
### Cloudflare Edge Stack Edition

---

## 1. Project Overview

Internet Billing Management System (IBMS) adalah aplikasi web yang digunakan oleh penyedia layanan internet (ISP) skala kecil hingga menengah untuk mengelola data pelanggan, mencatat pembayaran bulanan, memantau status tagihan, serta menghasilkan invoice yang dapat dikirim ke pelanggan.

Tujuan utama: menggantikan pencatatan manual berbasis Excel dengan sistem terpusat yang cepat, akurat, dan mudah dipantau — dijalankan sepenuhnya di atas ekosistem Cloudflare (Workers, D1, R2, KV, Queues, Cron Triggers) supaya biaya hosting rendah, latency rendah (edge-native), dan proses deploy sederhana lewat Wrangler.

---

## 2. Problem Statement

Pencatatan pembayaran pelanggan saat ini masih manual, menimbulkan kendala:

- Sulit mengetahui pelanggan yang sudah/belum membayar.
- Invoice dibuat manual, rawan salah tulis.
- Riwayat pembayaran sulit ditelusuri.
- Tidak ada dashboard pendapatan bulanan.
- Berpotensi terjadi kesalahan pencatatan (human error).

Aplikasi ini harus menyelesaikan seluruh masalah di atas dengan arsitektur yang murah dijalankan dan mudah di-maintain oleh tim kecil.

---

## 3. Target Users

| Role | Akses |
|---|---|
| Owner ISP | Full access, laporan keuangan, semua data |
| Admin | Kelola pelanggan, tagihan, pembayaran |
| Staff Keuangan | Input pembayaran, lihat laporan |

Tidak ada akses pelanggan (customer portal) di versi pertama — masuk **Future Features**.

---

## 4. Technology Stack (Cloudflare-Native)

| Layer | Teknologi | Alasan |
|---|---|---|
| Frontend | Next.js (App Router) + TypeScript + TailwindCSS + Shadcn UI, di-deploy via **Cloudflare Pages** (`@opennextjs/cloudflare`) | Konsisten dengan stack proyek lain kamu, SSR tetap jalan di edge |
| Backend API | **Hono** di atas **Cloudflare Workers** | Framework paling ringan & native untuk Workers runtime, cold-start nyaris nol |
| Database | **Cloudflare D1** (SQLite, serverless, binding native) | Tidak perlu koneksi eksternal, gratis untuk skala kecil-menengah ISP |
| ORM | **Drizzle ORM** (driver D1) | Type-safe, dukungan native D1, migration mudah |
| File Storage | **Cloudflare R2** | Simpan PDF invoice, logo ISP, lampiran |
| Cache / Session | **Cloudflare KV** | Simpan JWT blacklist, cache dashboard, rate-limit counter |
| Background Jobs | **Cloudflare Queues** | Kirim blast reminder WhatsApp tanpa kena rate limit / timeout |
| Scheduler | **Cloudflare Cron Triggers** | Generate tagihan otomatis tiap awal bulan |
| PDF Generation | **Cloudflare Browser Rendering API** (fallback: `pdf-lib`, pure JS) | Puppeteer/React-PDF klasik tidak jalan di Workers runtime; Browser Rendering API resmi dari Cloudflare untuk render HTML → PDF |
| Excel Export | **SheetJS (xlsx)** | Pure JS, kompatibel dengan Workers (ExcelJS bergantung ke Node `fs`, tidak dipakai) |
| Auth | JWT (`hono/jwt`) + password hashing via Web Crypto (`PBKDF2`/`scrypt`), bukan `bcrypt` native karena butuh Node binding | Kompatibel penuh dengan Workers runtime |
| WhatsApp Gateway | Provider HTTP API (Fonnte / Wablas / Qontak) dipanggil via `fetch()` dari Worker/Queue consumer | Tidak butuh library khusus, cukup REST call |
| Deployment | **Wrangler CLI** | `wrangler deploy` untuk API, Cloudflare Pages untuk frontend |
| Monorepo | Turborepo (opsional, `apps/web` + `apps/api` + `packages/db`) | Konsisten dengan pola project kamu sebelumnya |

> Catatan: Jika volume data ISP besar (>50rb baris tagihan/tahun, butuh query relasional kompleks/reporting berat), pertimbangkan **Neon PostgreSQL + Drizzle** sebagai pengganti D1. Untuk skala ISP kecil–menengah, D1 lebih dari cukup dan lebih murah.

---

## 5. System Architecture (High Level)

```
┌─────────────────────┐        ┌──────────────────────────┐
│ Next.js (Cloudflare  │  HTTPS │  Hono API (Cloudflare      │
│ Pages) - Admin UI    │◄──────►│  Workers)                  │
└─────────────────────┘        │  - Auth (JWT)               │
                                │  - CRUD Customer/Package    │
                                │  - Billing Engine           │
                                │  - Invoice Generator        │
                                └──────┬─────────┬───────────┘
                                       │         │
                    ┌──────────────────┘         └───────────────┐
                    ▼                                             ▼
        ┌────────────────────┐                        ┌─────────────────────┐
        │ Cloudflare D1       │                        │ Cloudflare R2        │
        │ (Customers, Invoice,│                        │ (Invoice PDF, Logo)  │
        │ Payment, Package)   │                        └─────────────────────┘
        └────────────────────┘

        ┌────────────────────┐        ┌─────────────────────┐
        │ Cron Trigger         │───────►│ Generate Invoice     │
        │ (tiap tgl 1, 00:00)  │        │ Bulanan (Worker)      │
        └────────────────────┘        └─────────────────────┘

        ┌────────────────────┐        ┌─────────────────────┐
        │ Cloudflare Queues    │───────►│ WA Reminder Consumer  │
        │ (reminder job)        │        │ → Fonnte/Wablas API   │
        └────────────────────┘        └─────────────────────┘
```

---

## 6. Main Features

### 6.1 Authentication
- Login via email + password.
- Role: `owner`, `admin`, `finance`.
- JWT disimpan di httpOnly cookie, refresh token via KV.
- Password di-hash dengan PBKDF2 (Web Crypto API, kompatibel Workers).

### 6.2 Dashboard
Ringkasan:
- Total pelanggan, pelanggan aktif
- Pelanggan sudah bayar / belum bayar bulan ini
- Total pendapatan bulan ini & tahun berjalan
- Grafik pembayaran bulanan (Recharts di frontend)
- Grafik pertumbuhan pelanggan aktif

Data agregat di-cache di **KV** (TTL 5 menit) supaya dashboard tetap cepat walau query D1 agak berat.

### 6.3 Customer Management
CRUD pelanggan dengan field: kode pelanggan (auto), nama, no. WhatsApp, email, alamat, paket, tanggal berlangganan, status (`active`/`suspend`/`stopped`), catatan.
Search & filter by nama, no. WA, paket, status — pagination server-side (D1 `LIMIT`/`OFFSET`).

### 6.4 Package Management
CRUD paket internet: nama, kecepatan, harga, deskripsi.

### 6.5 Billing Management
- Cron Trigger tiap tanggal 1 jam 00:00 WIB memicu Worker `generateMonthlyInvoices`.
- Buat invoice untuk semua pelanggan `status = active`.
- Satu pelanggan hanya boleh punya satu invoice per bulan (unique constraint `customer_id + billing_month + billing_year`).
- Admin bisa trigger manual re-generate lewat endpoint terproteksi (role `owner`/`admin`).

### 6.6 Payment Recording
Input pembayaran (invoice, tanggal bayar, metode, nominal, catatan) → status invoice otomatis jadi `paid`.

### 6.7 Invoice Generator
- Template HTML invoice (logo ISP, data pelanggan, paket, periode, total, status, QR code opsional).
- Di-render jadi PDF lewat **Browser Rendering API**, hasil disimpan ke **R2**, lalu di-cache URL-nya.
- Bisa: Download PDF, Print (frontend `window.print()`), Share via WhatsApp (kirim link R2 lewat WA Gateway).

### 6.8 Payment Status
Dua tab:
- **Sudah Bayar**: nama, paket, bulan, tanggal bayar, nominal.
- **Belum Bayar**: nama, paket, no. WA, jatuh tempo — tombol "Kirim Reminder".

### 6.9 WhatsApp Reminder
- Admin pilih pelanggan menunggak → klik "Kirim Reminder".
- Request masuk ke **Cloudflare Queue** (`wa-reminder-queue`) agar tidak memblokir request utama dan menghindari rate-limit provider WA.
- Queue consumer memanggil WA Gateway API dengan template:
  > "Halo {{nama}}, tagihan internet bulan {{bulan}} sebesar Rp {{nominal}} telah jatuh tempo. Mohon segera melakukan pembayaran. Terima kasih."

### 6.10 Reports
- Pendapatan harian/bulanan/tahunan, pelanggan aktif, pelanggan menunggak.
- Export PDF (Browser Rendering API) & Excel (SheetJS, generate buffer di Worker lalu stream sebagai response).

---

## 7. Database Schema (Cloudflare D1 / SQLite via Drizzle)

```ts
// users
id INTEGER PRIMARY KEY AUTOINCREMENT
name TEXT NOT NULL
email TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL
role TEXT CHECK(role IN ('owner','admin','finance')) NOT NULL
created_at TEXT DEFAULT (datetime('now'))

// customers
id INTEGER PRIMARY KEY AUTOINCREMENT
customer_code TEXT UNIQUE NOT NULL
name TEXT NOT NULL
phone TEXT NOT NULL
email TEXT
address TEXT
package_id INTEGER REFERENCES packages(id)
status TEXT CHECK(status IN ('active','suspend','stopped')) DEFAULT 'active'
subscribed_at TEXT
note TEXT
created_at TEXT DEFAULT (datetime('now'))

// packages
id INTEGER PRIMARY KEY AUTOINCREMENT
name TEXT NOT NULL
speed TEXT NOT NULL
price INTEGER NOT NULL
description TEXT

// invoices
id INTEGER PRIMARY KEY AUTOINCREMENT
invoice_number TEXT UNIQUE NOT NULL
customer_id INTEGER REFERENCES customers(id)
package_price INTEGER NOT NULL
billing_month INTEGER NOT NULL
billing_year INTEGER NOT NULL
due_date TEXT NOT NULL
total INTEGER NOT NULL
status TEXT CHECK(status IN ('unpaid','paid','late')) DEFAULT 'unpaid'
pdf_r2_key TEXT
created_at TEXT DEFAULT (datetime('now'))
UNIQUE(customer_id, billing_month, billing_year)

// payments
id INTEGER PRIMARY KEY AUTOINCREMENT
invoice_id INTEGER REFERENCES invoices(id)
payment_date TEXT NOT NULL
payment_method TEXT NOT NULL
amount INTEGER NOT NULL
note TEXT
created_at TEXT DEFAULT (datetime('now'))
```

---

## 8. API Endpoints (Hono Routes)

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/customers            ?search=&status=&page=
POST   /api/customers
GET    /api/customers/:id
PATCH  /api/customers/:id
DELETE /api/customers/:id

GET    /api/packages
POST   /api/packages
PATCH  /api/packages/:id
DELETE /api/packages/:id

GET    /api/invoices             ?month=&year=&status=
POST   /api/invoices/generate    (manual trigger, role owner/admin)
GET    /api/invoices/:id
GET    /api/invoices/:id/pdf     (stream/redirect ke R2)

POST   /api/payments             { invoice_id, payment_date, method, amount, note }
GET    /api/payments             ?invoice_id=

GET    /api/dashboard/summary
GET    /api/dashboard/charts

POST   /api/reminders/send       { customer_ids: [] }  → push ke Queue

GET    /api/reports/revenue      ?range=daily|monthly|yearly
GET    /api/reports/export       ?type=pdf|excel
```

Semua endpoint (kecuali `/auth/login`) diproteksi middleware JWT + role-check di Hono.

---

## 9. Business Rules

- Invoice dibuat otomatis setiap awal bulan via Cron Trigger.
- Satu pelanggan hanya memiliki satu invoice per bulan (enforced via unique constraint di D1).
- Pembayaran tercatat → status invoice otomatis `paid`.
- Pelanggan `suspend` tidak dibuatkan invoice bulan berjalan.
- Pelanggan `stopped` tidak muncul pada proses billing berikutnya.
- Invoice yang lewat `due_date` dan belum dibayar otomatis berstatus `late` (dicek oleh Cron harian ringan).

---

## 10. Non-Functional Requirements

- Responsive & mobile friendly.
- Fast loading (edge-rendered, TTFB rendah karena Workers).
- Secure authentication (JWT + hashed password, HTTPS only).
- Clean UI, dark mode support.
- Pagination di semua listing.
- Export PDF & Excel.
- Rate limiting dasar di endpoint publik/login (via KV counter).

---

## 11. Environment & Bindings (`wrangler.toml`)

```toml
name = "ibms-api"
main = "src/index.ts"
compatibility_date = "2026-07-01"

[[d1_databases]]
binding = "DB"
database_name = "ibms-db"
database_id = "<your-d1-id>"

[[r2_buckets]]
binding = "INVOICE_BUCKET"
bucket_name = "ibms-invoices"

[[kv_namespaces]]
binding = "CACHE_KV"
id = "<your-kv-id>"

[[queues.producers]]
binding = "WA_REMINDER_QUEUE"
queue = "wa-reminder-queue"

[[queues.consumers]]
queue = "wa-reminder-queue"

[triggers]
crons = ["0 17 1 * *"]  # tiap tgl 1, jam 00:00 WIB (UTC+7)

[vars]
JWT_SECRET = ""
WA_GATEWAY_API_KEY = ""
WA_GATEWAY_URL = ""
```

---

## 12. Deployment Strategy

1. **Backend (Hono API):** `wrangler deploy` — deploy ke Cloudflare Workers, bindings D1/R2/KV/Queues sudah terhubung otomatis lewat `wrangler.toml`.
2. **Frontend (Next.js):** deploy via Cloudflare Pages menggunakan adapter `@opennextjs/cloudflare`, atau `wrangler pages deploy` jika full static/SSR ringan.
3. **Migrasi DB:** `wrangler d1 migrations apply ibms-db` (Drizzle Kit generate migration files).
4. **Secrets:** `wrangler secret put JWT_SECRET`, `wrangler secret put WA_GATEWAY_API_KEY` (jangan taruh di `vars` untuk production).
5. **Monitoring:** Cloudflare Workers Analytics + Logpush (opsional) untuk error tracking.

---

## 13. Roadmap (Phased)

| Fase | Fokus |
|---|---|
| **Fase 1 (MVP)** | Auth, Customer & Package CRUD, Billing manual, Payment recording, Dashboard dasar |
| **Fase 2** | Invoice PDF (Browser Rendering API), Cron auto-generate tagihan, WhatsApp reminder via Queue |
| **Fase 3** | Reports + Export PDF/Excel, filter & search lanjutan, dark mode |
| **Fase 4** | Payment Gateway (Midtrans/Xendit), Auto-suspend pelanggan menunggak, Multi-admin & audit log |

---

## 14. Future Features

- Payment Gateway (Midtrans / Xendit)
- WhatsApp API otomatis dua-arah (webhook balasan pelanggan)
- Customer Portal (cek tagihan sendiri)
- Mobile App
- Email Invoice (via provider seperti Resend, kompatibel Workers)
- Auto Suspend pelanggan menunggak > N hari
- Multi Cabang ISP
- Multi Admin + Role granular + Audit Log
- Backup Database Otomatis (export D1 → R2 terjadwal via Cron)

---

*Dokumen ini disusun agar bisa langsung dieksekusi ke struktur Turborepo (`apps/web`, `apps/api`, `packages/db`) dan di-deploy penuh di Cloudflare (Pages + Workers + D1 + R2 + KV + Queues).*
