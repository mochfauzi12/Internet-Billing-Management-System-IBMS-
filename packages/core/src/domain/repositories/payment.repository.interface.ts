import { Payment } from '../entities/payment.entity';

export interface IPaymentRepository {
  findById(id: number): Promise<Payment | null>;
  findByInvoiceId(invoiceId: number): Promise<Payment[]>;
  findMany(params?: { limit?: number; offset?: number }): Promise<{ data: Payment[]; total: number }>;
  create(data: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment>;
}
