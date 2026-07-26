export interface Payment {
  id: number;
  invoiceId: number;
  paymentDate: string;
  paymentMethod: string;
  amount: number;
  note?: string | null;
  createdAt: string;
}
