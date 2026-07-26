'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { MOCK_PACKAGES, MockPackage } from '@/lib/mock-data';
import { Plus, Pencil, Trash2, Wifi } from 'lucide-react';

export default function PackagesPage() {
  const [packages, setPackages] = useState<MockPackage[]>(MOCK_PACKAGES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<MockPackage | null>(null);

  const [name, setName] = useState('');
  const [speed, setSpeed] = useState('');
  const [price, setPrice] = useState<number>(150000);
  const [description, setDescription] = useState('');

  const handleOpenModal = (pkg?: MockPackage) => {
    if (pkg) {
      setEditingPkg(pkg);
      setName(pkg.name);
      setSpeed(pkg.speed);
      setPrice(pkg.price);
      setDescription(pkg.description);
    } else {
      setEditingPkg(null);
      setName('');
      setSpeed('');
      setPrice(150000);
      setDescription('');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPkg) {
      setPackages(packages.map((item) => (item.id === editingPkg.id ? { ...item, name, speed, price, description } : item)));
    } else {
      setPackages([...packages, { id: Date.now(), name, speed, price, description }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Hapus paket internet ini?')) {
      setPackages(packages.filter((item) => item.id !== id));
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
              <h1 className="text-2xl font-bold text-gray-900">Paket Internet</h1>
              <p className="text-sm text-gray-500">Kelola daftar paket internet, kecepatan, dan tarif bulanan</p>
            </div>
            <Button variant="primary" className="gap-2" onClick={() => handleOpenModal()}>
              <Plus className="w-4 h-4" />
              Tambah Paket Baru
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Wifi className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{pkg.name}</h3>
                    <span className="inline-block px-2.5 py-0.5 mt-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                      {pkg.speed}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{pkg.description}</p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400">Tarif / Bulan</span>
                    <div className="text-xl font-extrabold text-gray-900">Rp {pkg.price.toLocaleString('id-ID')}</div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenModal(pkg)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPkg ? 'Edit Paket Internet' : 'Tambah Paket Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Nama Paket *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: Standard Home 20 Mbps"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Kecepatan (Bandwidth) *</label>
              <input
                type="text"
                required
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                placeholder="20 Mbps"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Harga Bulanan (Rp) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Deskripsi Paket</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Catatan kelebihan paket..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Paket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
