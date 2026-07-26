export type InvoiceStatus = 'unpaid' | 'paid' | 'late';

export interface Invoice {
  id: number;
  invoiceNumber: string;
  customerId: number;
  packagePrice: number;
  billingMonth: number;
  billingYear: number;
  dueDate: string;
  total: number;
  status: InvoiceStatus;
  pdfR2Key?: string | null;
  createdAt: string;
}
