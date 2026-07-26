export interface MockCustomer {
  id: number;
  customerCode: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  packageName: string;
  packagePrice: number;
  status: 'Aktif' | 'Suspend' | 'Berhenti';
  subscribedAt: string;
}

export interface MockPackage {
  id: number;
  name: string;
  speed: string;
  price: number;
  description: string;
}

export interface MockInvoice {
  id: number;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  packageName: string;
  period: string;
  total: number;
  dueDate: string;
  status: 'LUNAS' | 'BELUM BAYAR' | 'TERLAMBAT';
  paidAt?: string;
}

export interface MockPayment {
  id: number;
  invoiceNumber: string;
  customerName: string;
  paymentDate: string;
  paymentMethod: string;
  amount: number;
  note?: string;
}

export const MOCK_PACKAGES: MockPackage[] = [
  { id: 1, name: 'Basic Home 10 Mbps', speed: '10 Mbps', price: 150000, description: 'Cocok untuk penggunaan browsing & WhatsApp sehari-hari' },
  { id: 2, name: 'Standard Home 20 Mbps', speed: '20 Mbps', price: 250000, description: 'Streaming HD & game online keluarga kecil' },
  { id: 3, name: 'Super Fast 50 Mbps', speed: '50 Mbps', price: 450000, description: 'Kecepatan tinggi tanpa batas untuk bisnis & keluarga besar' },
  { id: 4, name: 'Ultra Pro 100 Mbps', speed: '100 Mbps', price: 750000, description: 'Dedicated bandwidth untuk kantor & cafe' },
];

export const MOCK_CUSTOMERS: MockCustomer[] = [
  { id: 1, customerCode: 'CUST-001', name: 'Budi Santoso', phone: '081234567890', email: 'budi@gmail.com', address: 'Jl. Merdeka No. 12, Bandung', packageName: 'Standard Home 20 Mbps', packagePrice: 250000, status: 'Aktif', subscribedAt: '2024-01-15' },
  { id: 2, customerCode: 'CUST-002', name: 'Siti Aminah', phone: '082198765432', email: 'siti@yahoo.com', address: 'Jl. Mawar No. 45, Bandung', packageName: 'Basic Home 10 Mbps', packagePrice: 150000, status: 'Aktif', subscribedAt: '2024-02-01' },
  { id: 3, customerCode: 'CUST-003', name: 'Ahmad Dahlan', phone: '085712345678', email: 'ahmad@gmail.com', address: 'Jl. Anggrek No. 8, Cimahi', packageName: 'Super Fast 50 Mbps', packagePrice: 450000, status: 'Suspend', subscribedAt: '2023-11-20' },
  { id: 4, customerCode: 'CUST-004', name: 'Dewi Lestari', phone: '081987654321', email: 'dewi@gmail.com', address: 'Jl. Kenanga No. 19, Bandung', packageName: 'Standard Home 20 Mbps', packagePrice: 250000, status: 'Aktif', subscribedAt: '2024-03-10' },
  { id: 5, customerCode: 'CUST-005', name: 'Rian Hidayat', phone: '083811223344', email: 'rian@gmail.com', address: 'Jl. Cempaka No. 88, Bandung', packageName: 'Ultra Pro 100 Mbps', packagePrice: 750000, status: 'Berhenti', subscribedAt: '2023-08-05' },
];

export const MOCK_INVOICES: MockInvoice[] = [
  { id: 1, invoiceNumber: 'INV-2024-05-0001', customerName: 'Budi Santoso', customerPhone: '081234567890', packageName: 'Standard Home 20 Mbps', period: 'Mei 2024', total: 250000, dueDate: '2024-05-10', status: 'LUNAS', paidAt: '2024-05-05' },
  { id: 2, invoiceNumber: 'INV-2024-05-0002', customerName: 'Siti Aminah', customerPhone: '082198765432', packageName: 'Basic Home 10 Mbps', period: 'Mei 2024', total: 150000, dueDate: '2024-05-10', status: 'BELUM BAYAR' },
  { id: 3, invoiceNumber: 'INV-2024-05-0003', customerName: 'Ahmad Dahlan', customerPhone: '085712345678', packageName: 'Super Fast 50 Mbps', period: 'Mei 2024', total: 450000, dueDate: '2024-05-10', status: 'TERLAMBAT' },
  { id: 4, invoiceNumber: 'INV-2024-05-0004', customerName: 'Dewi Lestari', customerPhone: '081987654321', packageName: 'Standard Home 20 Mbps', period: 'Mei 2024', total: 250000, dueDate: '2024-05-10', status: 'LUNAS', paidAt: '2024-05-08' },
];

export const MOCK_PAYMENTS: MockPayment[] = [
  { id: 1, invoiceNumber: 'INV-2024-05-0001', customerName: 'Budi Santoso', paymentDate: '2024-05-05 14:20', paymentMethod: 'Transfer Bank (BCA)', amount: 250000, note: 'Lunas via BCA Mobile' },
  { id: 2, invoiceNumber: 'INV-2024-05-0004', customerName: 'Dewi Lestari', paymentDate: '2024-05-08 09:15', paymentMethod: 'QRIS', amount: 250000, note: 'QRIS ShopeePay' },
];
