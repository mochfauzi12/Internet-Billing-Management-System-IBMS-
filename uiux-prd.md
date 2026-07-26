# UI/UX PRD — NetISP (Internet Billing Management System)

Dokumen ini mendokumentasikan spesifikasi UI/UX berdasarkan prototype yang sudah dibuat, sebagai acuan implementasi frontend (Next.js + TailwindCSS + Shadcn UI).

---

## 1. Overview

Prototype menampilkan admin panel untuk ISP bernama **"NetISP"** dengan gaya desain **clean, functional, data-dense dashboard** — cocok untuk pengguna internal (admin/owner/staff keuangan), bukan customer-facing. Layout menggunakan pola **sidebar navigation + topbar**, umum dipakai pada SaaS admin panel (mirip Shadcn Admin / Tailwind Admin templates).

---

## 2. Design System

### 2.1 Color Palette

| Token | Warna | Penggunaan |
|---|---|---|
| Primary | Blue `#2563EB` (Tailwind `blue-600`) | Tombol utama, active nav item, link, header invoice |
| Success | Green `#16A34A` (`green-600`) | Status "Lunas", "Aktif", ikon growth positif |
| Warning | Amber/Orange `#F59E0B` (`amber-500`) | Status "Belum Bayar", "Suspend" |
| Danger | Red `#DC2626` (`red-600`) | Status "Terlambat", ikon delete |
| Info | Sky/Teal muda | Icon background stat card sekunder |
| Neutral background | `gray-50` / white | Background halaman & card |
| Border | `gray-200` | Pemisah tabel, card border |
| Text primary | `gray-900` | Judul, angka besar |
| Text secondary | `gray-500` | Subtitle, label kecil |
| Sidebar active | Light blue bg (`blue-50`) + blue text/icon | Menu aktif ("Dashboard") |

### 2.2 Typography

- Font: sans-serif modern (setara Inter/Geist — konsisten dengan Shadcn default).
- Judul halaman: `text-2xl font-semibold` (contoh: "Dashboard", "Pelanggan").
- Subtitle halaman: `text-sm text-gray-500` di bawah judul.
- Angka statistik besar (stat card): `text-2xl font-bold`.
- Label tabel header: `text-xs uppercase text-gray-500`.

### 2.3 Layout Grid

- Sidebar tetap (fixed) lebar ±240px, collapsible via ikon hamburger.
- Topbar height ±64px, isi: toggle sidebar, notifikasi (badge counter), profil admin (dropdown).
- Konten utama: grid responsif — stat card 6 kolom pada desktop besar, chart & list 2 kolom, tabel full width.
- Card menggunakan `rounded-xl`, `shadow-sm`, padding konsisten `p-4`/`p-6`.

### 2.4 Iconography

Gunakan **lucide-react**, konsisten dengan stack yang sudah direkomendasikan:
`Wifi`, `Users`, `UserCheck`, `CheckCircle2`, `XCircle`, `Wallet`, `TrendingUp`, `Bell`, `Search`, `Filter`, `Plus`, `Eye`, `Pencil`, `Trash2`, `Download`, `MessageCircleMore` (WhatsApp-style), `FileText`, `ChevronLeft`, `ChevronRight`.

### 2.5 Component Base

Gunakan **Shadcn UI**: `Card`, `Table`, `Badge`, `Button`, `Input`, `Select`, `Dialog`/`Sheet` (untuk form Catat Pembayaran), `Avatar`, `DropdownMenu`, `Breadcrumb`, `Pagination`, `Tabs` (dipakai di halaman Laporan).

---

## 3. Global Layout

### 3.1 Topbar
- Logo brand kiri (ikon Wifi + "NetISP" + tagline kecil "Internet Service Provider").
- Ikon hamburger untuk collapse sidebar.
- Kanan: ikon lonceng notifikasi dengan badge angka merah, dropdown profil ("Admin ISP" + role "Administrator").

### 3.2 Sidebar Navigation
Urutan menu (dengan ikon masing-masing):
1. Dashboard *(default active)*
2. Pelanggan
3. Paket Internet
4. Tagihan *(punya submenu, ditandai chevron)*
5. Pembayaran
6. Status Pembayaran
7. Reminder
8. Laporan *(punya submenu)*
9. Pengaturan
10. Pengguna

Bagian bawah sidebar: kartu profil admin (avatar + nama + email) dengan chevron untuk expand menu akun (logout, dsb).

---

## 4. Screen Specifications

### 4.1 Login

| Elemen | Detail |
|---|---|
| Layout | Split-screen: panel kiri dekoratif (dark navy, brand + tagline + ilustrasi), panel kanan form login putih |
| Panel kiri | Logo NetISP, tagline "Kelola pelanggan dan pembayaran internet lebih mudah dan efisien.", ilustrasi ikon (laptop/cloud/wifi) |
| Form | Judul "Selamat Datang" + subtitle "Silakan login untuk melanjutkan", input Email (prefilled contoh `admin@netisp.id`), input Password dengan link "Lupa Password", checkbox "Ingat saya", tombol primer "Login" full-width, footer copyright |
| State tambahan yang perlu ditambahkan saat implementasi | Error validasi (email/password salah), loading state tombol Login |

### 4.2 Dashboard

**Header:** "Dashboard" + subtitle "Ringkasan informasi bisnis Anda"

**Baris Stat Card (6 kartu, grid horizontal):**
1. Total Pelanggan — angka besar + label "Semua pelanggan"
2. Pelanggan Aktif — angka + label "Pelanggan aktif"
3. Sudah Bayar (Bulan ini) — angka + persentase dari total
4. Belum Bayar (Bulan ini) — angka + persentase dari total
5. Total Pendapatan (Bulan ini) — nominal Rupiah + indikator growth
6. Pendapatan (Tahun ini) — nominal Rupiah + "+X% dari tahun lalu"

Setiap kartu: ikon berwarna dalam kotak rounded di kiri atas, angka besar, label deskripsi kecil.

**Baris Chart (2 kolom):**
- **Grafik Pendapatan Bulanan** — line chart, filter dropdown tahun (mis. "Tahun 2024"), sumbu Y dalam satuan "jt" (juta).
- **Grafik Pelanggan Aktif** — area/line chart, filter dropdown rentang waktu ("6 Bulan Terakhir").

**Baris List (2 kolom):**
- **Pelanggan Terbaru** — daftar 4 pelanggan terbaru (avatar, nama, paket, tanggal daftar) + link "Lihat Semua".
- **Tagihan Belum Dibayar** — daftar 4 tagihan (nama, bulan, nominal, badge status "Terlambat"/"Belum Bayar") + link "Lihat Semua".

### 4.3 Pelanggan (Customer List)

- Header "Pelanggan" + subtitle "Kelola data pelanggan Anda"
- Toolbar: search input "Cari pelanggan...", filter dropdown "Semua Paket", filter dropdown "Semua Status", tombol primer "+ Tambah Pelanggan"
- **Tabel** — kolom: ID Pelanggan, Nama, Paket, No. WhatsApp, Status (badge), Aksi (ikon Lihat/Edit/Hapus)
- Badge status: `Aktif` (hijau), `Suspend` (oranye) — perlu ditambah `Berhenti` (abu-abu/merah) sesuai business rule
- Pagination di bawah tabel (nomor halaman + prev/next)

### 4.4 Paket Internet

- Header "Paket Internet" + subtitle "Kelola paket internet Anda" + tombol "+ Tambah Paket"
- **Tabel** — kolom: Nama Paket, Speed, Harga, Deskripsi, Aksi (Lihat/Edit/Hapus)
- Tanpa pagination terlihat (asumsi jumlah paket sedikit, tapi tetap disiapkan untuk skalabilitas)

### 4.5 Tagihan (Invoice List)

- Header "Tagihan" + subtitle "Daftar tagihan pelanggan"
- Toolbar: search "Cari invoice...", filter dropdown bulan ("Mei"), filter dropdown tahun ("2024"), tombol primer "Generate Tagihan"
- **Tabel** — kolom: No. Invoice, Pelanggan, Paket, Periode, Total, Status (badge), Aksi (ikon lihat detail)
- Badge status: `LUNAS` (hijau), `BELUM BAYAR` (oranye), `TERLAMBAT` (merah)
- Pagination

### 4.6 Detail Invoice

- Breadcrumb: `Tagihan / Invoice / INV-2024-05-0001`
- Tombol aksi kanan atas: "Download PDF" (outline), "Kirim WhatsApp" (hijau, solid)
- **Kartu Invoice:**
  - Header brand: logo + nama ISP + label besar "INVOICE" + nomor invoice
  - Info ISP (alamat, kontak) sejajar dengan info Tanggal / Periode / Jatuh Tempo
  - Bagian "Tagihan Kepada": nama pelanggan + alamat + kontak
  - Tabel item: Deskripsi, Paket, Harga (baris: "Internet 20 Mbps")
  - Baris TOTAL, ditonjolkan (bold, ukuran besar)
  - **Panel Status Pembayaran**: badge besar "LUNAS" (hijau) atau setara "Belum Bayar"/"Terlambat", + keterangan tanggal bayar
  - Footer ucapan terima kasih + nama brand

### 4.7 Pembayaran — Catat Pembayaran (Form)

- Breadcrumb: `Pembayaran / Catat Pembayaran`
- **Form fields:**
  - Invoice (dropdown/select, format `"{no_invoice} - {nama_pelanggan}"`)
  - Tanggal Pembayaran (date picker)
  - Metode Pembayaran (dropdown: Transfer Bank, Tunai, QRIS, dll.)
  - Bank/Akun (dropdown, muncul kondisional jika metode = Transfer Bank)
  - Nominal (input angka, format Rupiah)
  - Catatan (opsional, textarea/input teks)
- **Tombol:** "Batal" (outline/secondary) dan "Simpan Pembayaran" (primer, biru)
- Setelah simpan: status invoice terkait otomatis berubah jadi `LUNAS` (business rule dari PRD backend)

### 4.8 Status Pembayaran — Belum Bayar

- Header "Belum Bayar" + subtitle "Daftar pelanggan yang belum membayar" + tombol hijau "Kirim Reminder ke Semua"
- Search "Cari pelanggan..."
- **Tabel** — kolom: Pelanggan, Paket, Periode, Jatuh Tempo, Tagihan, Aksi (tombol "Kirim Reminder" per baris)
- Tab terkait "Sudah Bayar" perlu dibuat simetris (kolom: Nama, Paket, Bulan, Tanggal Bayar, Nominal) — belum terlihat di prototype tapi disebut di PRD fungsional, harus ditambahkan sebagai tab kedua di halaman yang sama.

### 4.9 Reminder

Menu terpisah di sidebar; berdasarkan alur pada halaman "Belum Bayar", perilaku tombol "Kirim Reminder" (per baris) dan "Kirim Reminder ke Semua" (bulk) adalah entry point ke fitur ini. Perlu ditambahkan:
- Konfirmasi modal sebelum kirim (menampilkan preview template pesan WhatsApp)
- Riwayat reminder terkirim (log: kapan, ke siapa, status terkirim/gagal)

### 4.10 Laporan

- Header "Laporan" + subtitle "Pilih laporan yang ingin ditampilkan"
- **Tabs:** Pendapatan (aktif), Pelanggan, Tagihan, Pembayaran
- Filter: dropdown periode cepat ("Bulan ini"), dropdown bulan ("Mei"), dropdown tahun ("2024"), tombol "Export"
- **Ringkasan angka:** Total Pendapatan, Total Transaksi, Rata-rata Transaksi (3 kartu horizontal)
- **Bar chart** pendapatan harian dalam bulan terpilih (sumbu X: tanggal 1–31, sumbu Y dalam "jt")

---

## 5. Status & Badge Color Mapping

| Konteks | Status | Warna Badge |
|---|---|---|
| Pelanggan | Aktif | Hijau |
| Pelanggan | Suspend | Oranye |
| Pelanggan | Berhenti *(baru, sesuai business rule)* | Abu-abu/Merah |
| Invoice | Lunas | Hijau |
| Invoice | Belum Bayar | Oranye |
| Invoice | Terlambat | Merah |

---

## 6. Component Inventory (untuk dibangun sebagai reusable component)

- `StatCard` (ikon, angka, label, opsional persen growth)
- `DataTable` (header sortable, badge status, action icons, built-in pagination)
- `SearchFilterBar` (search input + 1-2 select filter + tombol aksi kanan)
- `StatusBadge` (varian warna sesuai §5)
- `LineChartCard` / `BarChartCard` (Recharts, dengan dropdown filter periode di header card)
- `RecentListCard` (list ringkas dengan avatar + link "Lihat Semua")
- `InvoiceDocument` (komponen cetak/PDF invoice, dipakai juga untuk generate PDF di backend)
- `PaymentFormSheet` (form dalam Dialog/Sheet untuk Catat Pembayaran)
- `ConfirmDialog` (dipakai untuk delete, kirim reminder bulk, generate tagihan ulang)
- `Breadcrumb`

---

## 7. Interaction & UX Notes

- Semua aksi destruktif (Hapus pelanggan/paket, Generate Ulang Tagihan) wajib melalui `ConfirmDialog`.
- Tombol "Generate Tagihan" dan "Kirim Reminder ke Semua" perlu loading state + toast notifikasi sukses/gagal (karena berpotensi proses agak lama / queue-based di backend).
- Tabel kosong (empty state) perlu ilustrasi/pesan sederhana, misalnya saat filter tidak menghasilkan data.
- Form Catat Pembayaran: validasi nominal tidak boleh 0/kosong, tanggal tidak boleh di masa depan.
- Status badge harus konsisten warnanya di semua halaman (Dashboard, Tagihan, Detail Invoice, Belum Bayar).

---

## 8. Responsive Notes

Prototype didesain untuk desktop (≥1280px). Untuk implementasi, perlu ditambahkan breakpoint:
- **Tablet (768–1024px):** sidebar collapse jadi ikon saja, stat card jadi 3 kolom x 2 baris, chart tetap 2 kolom.
- **Mobile (<768px):** sidebar jadi drawer (overlay), stat card 1 kolom (scroll), tabel jadi card list vertikal atau scroll horizontal.

---

## 9. Accessibility Notes

- Kontras warna badge (terutama oranye di atas putih) perlu dicek AA compliance.
- Semua ikon aksi (Lihat/Edit/Hapus) wajib punya `aria-label`.
- Form Login & Catat Pembayaran wajib label eksplisit (bukan hanya placeholder) untuk screen reader.

---

*Dokumen ini melengkapi `prd.md` (functional & technical PRD) sebagai acuan desain saat implementasi frontend Next.js + TailwindCSS + Shadcn UI di atas Cloudflare Pages.*
