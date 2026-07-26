import { IPaymentRepository, Payment } from '@ibms/core';
import { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { payments } from '../schema/payments';
import { eq } from 'drizzle-orm';

export class D1PaymentRepository implements IPaymentRepository {
  private db;

  constructor(d1: D1Database) {
    this.db = drizzle(d1);
  }

  async findById(id: number): Promise<Payment | null> {
    const res = await this.db.select().from(payments).where(eq(payments.id, id)).get();
    if (!res) return null;
    return this.mapToEntity(res);
  }

  async findByInvoiceId(invoiceId: number): Promise<Payment[]> {
    const res = await this.db.select().from(payments).where(eq(payments.invoiceId, invoiceId));
    return res.map(this.mapToEntity);
  }

  async findMany(params?: { limit?: number; offset?: number }): Promise<{ data: Payment[]; total: number }> {
    const limit = params?.limit ?? 50;
    const offset = params?.offset ?? 0;

    const data = await this.db.select().from(payments).limit(limit).offset(offset);
    return {
      data: data.map(this.mapToEntity),
      total: data.length,
    };
  }

  async create(data: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment> {
    const inserted = await this.db.insert(payments).values(data).returning().get();
    return this.mapToEntity(inserted);
  }

  private mapToEntity(row: any): Payment {
    return {
      id: row.id,
      invoiceId: row.invoiceId,
      paymentDate: row.paymentDate,
      paymentMethod: row.paymentMethod,
      amount: row.amount,
      note: row.note,
      createdAt: row.createdAt ?? '',
    };
  }
}
