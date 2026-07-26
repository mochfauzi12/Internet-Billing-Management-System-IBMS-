'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { CustomerFormModal } from '@/components/modules/customer-form-modal';
import { ConfirmDialog } from '@/components/modules/confirm-dialog';
import { MOCK_CUSTOMERS, MockCustomer, MOCK_PACKAGES } from '@/lib/mock-data';
import { Search, Plus, Eye, Pencil, Trash2 } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<MockCustomer[]>(MOCK_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [packageFilter, setPackageFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<MockCustomer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MockCustomer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm) || c.customerCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPackage = packageFilter ? c.packageName === packageFilter : true;
    const matchesStatus = statusFilter ? c.status === statusFilter : true;
    return matchesSearch && matchesPackage && matchesStatus;
  });

  const handleSaveCustomer = (data: any) => {
    if (editingCustomer) {
      setCustomers(customers.map((item) => (item.id === editingCustomer.id ? { ...item, ...data } : item)));
    } else {
      const newCustomer: MockCustomer = {
        id: Date.now(),
        customerCode: `CUST-00${customers.length + 1}`,
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        packageName: data.packageName,
        packagePrice: 250000,
        status: data.status,
        subscribedAt: new Date().toISOString().slice(0, 10),
      };
      setCustomers([newCustomer, ...customers]);
    }
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setCustomers(customers.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="p-6 space-y-6 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Pelanggan</h1>
              <p className="text-sm text-gray-500">Kelola informasi pelanggan internet ISP NetISP</p>
            </div>
            <Button
              variant="primary"
              className="gap-2"
              onClick={() => {
                setEditingCustomer(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Tambah Pelanggan Baru
            </Button>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama, kode, atau WhatsApp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <select
                value={packageFilter}
                onChange={(e) => setPackageFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Semua Paket</option>
                {MOCK_PACKAGES.map((pkg) => (
                  <option key={pkg.id} value={pkg.name}>
                    {pkg.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Suspend">Suspend</option>
                <option value="Berhenti">Berhenti</option>
              </select>
            </div>
          </div>

          {/* Tabel Data Pelanggan */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Kode / Nama</th>
                    <th className="px-6 py-3.5">No. WhatsApp</th>
                    <th className="px-6 py-3.5">Paket Internet</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Tgl Berlangganan</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                        Tidak ada data pelanggan yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{customer.name}</div>
                          <div className="text-xs text-gray-400">{customer.customerCode}</div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-800">{customer.phone}</td>
                        <td className="px-6 py-4 font-medium text-gray-800">{customer.packageName}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={customer.status} />
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">{customer.subscribedAt}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingCustomer(customer);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(customer)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <div>Menampilkan 1 - {filteredCustomers.length} dari {customers.length} pelanggan</div>
              <div className="flex gap-1">
                <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" disabled>
                  Prev
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded font-medium">1</button>
                <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100" disabled>
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveCustomer}
        initialData={editingCustomer}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Data Pelanggan"
        message={`Apakah Anda yakin ingin menghapus pelanggan "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
