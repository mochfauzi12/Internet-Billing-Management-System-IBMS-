'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { UserFormModal } from '@/components/modules/user-form-modal';
import { ConfirmDialog } from '@/components/modules/confirm-dialog';
import { ShieldCheck, Plus, Pencil, Trash2, UserCheck, KeyRound } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin ISP Utama', email: 'admin@netisp.id', role: 'owner', createdAt: '2024-01-01' },
    { id: 2, name: 'Budi Keuangan', email: 'finance@netisp.id', role: 'finance', createdAt: '2024-02-15' },
    { id: 3, name: 'Siti Admin', email: 'siti.admin@netisp.id', role: 'admin', createdAt: '2024-03-01' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const handleSaveUser = (data: any) => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...data } : u)));
    } else {
      const newUser = {
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setUsers([newUser, ...users]);
    }
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setUsers(users.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === 'owner') return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">Owner</span>;
    if (role === 'admin') return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Administrator</span>;
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Staff Keuangan</span>;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="p-6 space-y-6 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna & Admin</h1>
              <p className="text-sm text-gray-500">Kelola akun administrator, staf keuangan, dan perizinan role</p>
            </div>
            <Button
              variant="primary"
              className="gap-2"
              onClick={() => {
                setEditingUser(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Tambah Pengguna Baru
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Nama & Email</th>
                    <th className="px-6 py-3.5">Role / Hak Akses</th>
                    <th className="px-6 py-3.5">Dibuat Pada</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{u.name}</div>
                            <div className="text-xs text-gray-400 font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getRoleBadge(u.role)}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">{u.createdAt}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit User"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {u.role !== 'owner' && (
                          <button
                            onClick={() => setDeleteTarget(u)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Hapus User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveUser}
        initialData={editingUser}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Pengguna Admin"
        message={`Apakah Anda yakin ingin menghapus akun pengelola "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
