import React, { useState } from 'react';
import { Sheet } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MOCK_INVOICES } from '@/lib/mock-data';

interface PaymentFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payment: any) => void;
}

export function PaymentFormSheet({ isOpen, onClose, onSubmit }: PaymentFormSheetProps) {
  const unpaidInvoices = MOCK_INVOICES.filter((inv) => inv.status !== 'LUNAS');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number>(unpaidInvoices[0]?.id || MOCK_INVOICES[0].id);

  const selectedInvoice = MOCK_INVOICES.find((inv) => inv.id === Number(selectedInvoiceId)) || MOCK_INVOICES[0];

  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank');
  const [bankName, setBankName] = useState('Bank BCA');
  const [amount, setAmount] = useState<number>(selectedInvoice.total);
  const [note, setNote] = useState('');

  const handleInvoiceChange = (idStr: string) => {
    const id = Number(idStr);
    setSelectedInvoiceId(id);
    const inv = MOCK_INVOICES.find((item) => item.id === id);
    if (inv) {
      setAmount(inv.total);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      invoiceNumber: selectedInvoice.invoiceNumber,
      customerName: selectedInvoice.customerName,
      paymentDate,
      paymentMethod: paymentMethod === 'Transfer Bank' ? `Transfer Bank (${bankName})` : paymentMethod,
      amount,
      note,
    });
    onClose();
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Pembayaran Tagihan"
      subtitle="Masukkan detail transaksi pembayaran yang diterima"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Pilih Tagihan / Invoice *</label>
          <select
            value={selectedInvoiceId}
            onChange={(e) => handleInvoiceChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
          >
            {MOCK_INVOICES.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.invoiceNumber} - {inv.customerName} ({inv.period}) [Rp {inv.total.toLocaleString('id-ID')}]
              </option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 space-y-1 text-xs">
          <div className="flex justify-between text-blue-900 font-semibold">
            <span>Pelanggan:</span>
            <span>{selectedInvoice.customerName}</span>
          </div>
          <div className="flex justify-between text-blue-800">
            <span>Paket Internet:</span>
            <span>{selectedInvoice.packageName}</span>
          </div>
          <div className="flex justify-between text-blue-800">
            <span>Periode Tagihan:</span>
            <span>{selectedInvoice.period}</span>
          </div>
          <div className="flex justify-between text-blue-900 font-bold border-t border-blue-200 pt-1 mt-1">
            <span>Total Tagihan:</span>
            <span>Rp {selectedInvoice.total.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Tanggal Pembayaran *</label>
          <input
            type="date"
            required
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Metode Pembayaran *</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
          >
            <option value="Transfer Bank">Transfer Bank</option>
            <option value="Tunai / Cash">Tunai / Cash</option>
            <option value="QRIS">QRIS</option>
            <option value="E-Wallet">E-Wallet (OVO/Gopay/Dana)</option>
          </select>
        </div>

        {paymentMethod === 'Transfer Bank' && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Pilih Bank / Rekening</label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="BCA">Bank BCA (123-456-7890)</option>
              <option value="Mandiri">Bank Mandiri (987-654-3210)</option>
              <option value="BRI">Bank BRI (555-444-3332)</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Nominal Diterima (Rp) *</label>
          <input
            type="number"
            required
            min={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Catatan Transaksi</label>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="No. referensi transfer, nama pengirim, dsb."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="pt-4 flex gap-3 border-t border-gray-100">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            Simpan Pembayaran
          </Button>
        </div>
      </form>
    </Sheet>
  );
}
