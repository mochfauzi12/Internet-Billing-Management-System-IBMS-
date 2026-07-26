import { Payment } from '../entities/payment.entity';

export interface IPaymentRepository {
  findById(id: number): Promise<Payment | null>;
  findByInvoiceId(invoiceId: number): Promise<Payment[]>;
  create(data: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment>;
}
