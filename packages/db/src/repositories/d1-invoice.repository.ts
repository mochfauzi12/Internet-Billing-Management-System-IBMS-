import { IInvoiceRepository, InvoiceFilters, Invoice, InvoiceStatus } from '@ibms/core';
import { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { invoices } from '../schema/invoices';
import { eq, and, count, like } from 'drizzle-orm';

export class D1InvoiceRepository implements IInvoiceRepository {
  private db;

  constructor(d1: D1Database) {
    this.db = drizzle(d1);
  }

  async findById(id: number): Promise<Invoice | null> {
    const res = await this.db.select().from(invoices).where(eq(invoices.id, id)).get();
    if (!res) return null;
    return this.mapToEntity(res);
  }

  async findByNumber(invoiceNumber: string): Promise<Invoice | null> {
    const res = await this.db.select().from(invoices).where(eq(invoices.invoiceNumber, invoiceNumber)).get();
    if (!res) return null;
    return this.mapToEntity(res);
  }

  async findByCustomerAndPeriod(customerId: number, month: number, year: number): Promise<Invoice | null> {
    const res = await this.db
      .select()
      .from(invoices)
      .where(and(eq(invoices.customerId, customerId), eq(invoices.billingMonth, month), eq(invoices.billingYear, year)))
      .get();
    if (!res) return null;
    return this.mapToEntity(res);
  }

  async findMany(filters?: InvoiceFilters): Promise<{ data: Invoice[]; total: number }> {
    const conditions = [];

    if (filters?.customerId) conditions.push(eq(invoices.customerId, filters.customerId));
    if (filters?.month) conditions.push(eq(invoices.billingMonth, filters.month));
    if (filters?.year) conditions.push(eq(invoices.billingYear, filters.year));
    if (filters?.status) conditions.push(eq(invoices.status, filters.status));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const totalRes = await this.db.select({ count: count() }).from(invoices).where(whereClause).get();
    const total = totalRes?.count ?? 0;

    const dataRes = await this.db
      .select()
      .from(invoices)
      .where(whereClause)
      .limit(filters?.limit ?? 20)
      .offset(filters?.offset ?? 0);

    return {
      data: dataRes.map(this.mapToEntity),
      total,
    };
  }

  async create(data: Omit<Invoice, 'id' | 'createdAt'>): Promise<Invoice> {
    const inserted = await this.db.insert(invoices).values(data).returning().get();
    return this.mapToEntity(inserted);
  }

  async updateStatus(id: number, status: InvoiceStatus): Promise<Invoice> {
    const updated = await this.db.update(invoices).set({ status }).where(eq(invoices.id, id)).returning().get();
    return this.mapToEntity(updated);
  }

  async updatePdfKey(id: number, key: string): Promise<Invoice> {
    const updated = await this.db.update(invoices).set({ pdfR2Key: key }).where(eq(invoices.id, id)).returning().get();
    return this.mapToEntity(updated);
  }

  private mapToEntity(row: any): Invoice {
    return {
      id: row.id,
      invoiceNumber: row.invoiceNumber,
      customerId: row.customerId,
      packagePrice: row.packagePrice,
      billingMonth: row.billingMonth,
      billingYear: row.billingYear,
      dueDate: row.dueDate,
      total: row.total,
      status: row.status as InvoiceStatus,
      pdfR2Key: row.pdfR2Key,
      createdAt: row.createdAt ?? '',
    };
  }
}
