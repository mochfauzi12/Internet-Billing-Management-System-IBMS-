import { ICustomerRepository, CustomerFilters, Customer, CustomerStatus } from '@ibms/core';
import { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { customers } from '../schema/customers';
import { eq, like, and, count } from 'drizzle-orm';

export class D1CustomerRepository implements ICustomerRepository {
  private db;

  constructor(d1: D1Database) {
    this.db = drizzle(d1);
  }

  async findById(id: number): Promise<Customer | null> {
    const res = await this.db.select().from(customers).where(eq(customers.id, id)).get();
    if (!res) return null;
    return this.mapToEntity(res);
  }

  async findByCode(code: string): Promise<Customer | null> {
    const res = await this.db.select().from(customers).where(eq(customers.customerCode, code)).get();
    if (!res) return null;
    return this.mapToEntity(res);
  }

  async findMany(filters?: CustomerFilters): Promise<{ data: Customer[]; total: number }> {
    const conditions = [];

    if (filters?.search) {
      conditions.push(like(customers.name, `%${filters.search}%`));
    }
    if (filters?.status) {
      conditions.push(eq(customers.status, filters.status));
    }
    if (filters?.packageId) {
      conditions.push(eq(customers.packageId, filters.packageId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const totalRes = await this.db.select({ count: count() }).from(customers).where(whereClause).get();
    const total = totalRes?.count ?? 0;

    const dataRes = await this.db
      .select()
      .from(customers)
      .where(whereClause)
      .limit(filters?.limit ?? 10)
      .offset(filters?.offset ?? 0);

    return {
      data: dataRes.map(this.mapToEntity),
      total,
    };
  }

  async findActiveCustomers(): Promise<Customer[]> {
    const res = await this.db.select().from(customers).where(eq(customers.status, 'active'));
    return res.map(this.mapToEntity);
  }

  async create(data: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
    const inserted = await this.db.insert(customers).values(data).returning().get();
    return this.mapToEntity(inserted);
  }

  async update(id: number, data: Partial<Omit<Customer, 'id' | 'createdAt'>>): Promise<Customer> {
    const updated = await this.db.update(customers).set(data).where(eq(customers.id, id)).returning().get();
    return this.mapToEntity(updated);
  }

  async delete(id: number): Promise<boolean> {
    const res = await this.db.delete(customers).where(eq(customers.id, id)).run();
    return res.success;
  }

  private mapToEntity(row: any): Customer {
    return {
      id: row.id,
      customerCode: row.customerCode,
      name: row.name,
      phone: row.phone,
      email: row.email,
      address: row.address,
      packageId: row.packageId,
      status: row.status as CustomerStatus,
      subscribedAt: row.subscribedAt,
      note: row.note,
      createdAt: row.createdAt ?? '',
    };
  }
}
