import React from 'react';

export type StatusVariant = 'aktif' | 'lunas' | 'suspend' | 'belum_bayar' | 'terlambat' | 'berhenti' | 'active' | 'paid' | 'unpaid' | 'late' | 'stopped';

interface StatusBadgeProps {
  status: StatusVariant | string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  let style = 'bg-gray-100 text-gray-700 border-gray-200';
  let label = status;

  if (normalized === 'aktif' || normalized === 'active' || normalized === 'lunas' || normalized === 'paid') {
    style = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
    label = normalized === 'lunas' || normalized === 'paid' ? 'LUNAS' : 'Aktif';
  } else if (normalized === 'suspend' || normalized === 'belum_bayar' || normalized === 'unpaid' || normalized === 'belum bayar') {
    style = 'bg-amber-50 text-amber-700 border-amber-200 font-semibold';
    label = normalized === 'suspend' ? 'Suspend' : 'BELUM BAYAR';
  } else if (normalized === 'terlambat' || normalized === 'late') {
    style = 'bg-red-50 text-red-700 border-red-200 font-semibold';
    label = 'TERLAMBAT';
  } else if (normalized === 'berhenti' || normalized === 'stopped') {
    style = 'bg-gray-100 text-gray-600 border-gray-300 font-medium';
    label = 'Berhenti';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${style} ${className}`}
    >
      {label}
    </span>
  );
}
