export interface SendMessagePayload {
  toPhone: string;
  customerName: string;
  billingMonth: string;
  amount: number;
}

export interface IWhatsAppService {
  sendReminder(payload: SendMessagePayload): Promise<{ success: boolean; messageId?: string }>;
}
