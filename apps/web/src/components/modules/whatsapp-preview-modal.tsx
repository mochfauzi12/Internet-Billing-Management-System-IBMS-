import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send } from 'lucide-react';

interface WhatsAppPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  customerPhone: string;
  period: string;
  amount: number;
  onConfirmSend: () => void;
}

export function WhatsAppPreviewModal({
  isOpen,
  onClose,
  customerName,
  customerPhone,
  period,
  amount,
  onConfirmSend,
}: WhatsAppPreviewModalProps) {
  const messageTemplate = `Halo ${customerName},\n\nTagihan internet NetISP Anda untuk periode ${period} sebesar Rp ${amount.toLocaleString('id-ID')} telah jatuh tempo.\n\nMohon segera melakukan pembayaran melalui transfer bank BCA (123-456-7890 a.n NetISP) atau via QRIS.\n\nTerima kasih,\nTim NetISP`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Preview Pesan WhatsApp Reminder"
      subtitle="Pesan ini akan dikirim via Cloudflare Queue ke Fonnte WA Gateway"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-xs">
          <MessageSquare className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-semibold text-emerald-900">Penerima:</span>{' '}
            <span className="text-emerald-800 font-medium">{customerName} ({customerPhone})</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Isi Pesan WhatsApp:</label>
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed shadow-inner">
            {messageTemplate}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="success"
            className="gap-2"
            onClick={() => {
              onConfirmSend();
              onClose();
            }}
          >
            <Send className="w-4 h-4" />
            Kirim Reminder Sekarang
          </Button>
        </div>
      </div>
    </Modal>
  );
}
