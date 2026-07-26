import { IWhatsAppService, SendMessagePayload } from '@ibms/core';

export class FonnteWhatsAppService implements IWhatsAppService {
  constructor(
    private apiKey: string,
    private apiUrl = 'https://api.fonnte.com/send'
  ) {}

  async sendReminder(payload: SendMessagePayload): Promise<{ success: boolean; messageId?: string }> {
    const message = `Halo ${payload.customerName}, tagihan internet bulan ${payload.billingMonth} sebesar Rp ${payload.amount.toLocaleString('id-ID')} telah jatuh tempo. Mohon segera melakukan pembayaran. Terima kasih.`;

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: payload.toPhone,
        message,
      }),
    });

    const resJson = (await response.json()) as any;
    return {
      success: resJson.status === true,
      messageId: resJson.id,
    };
  }
}
