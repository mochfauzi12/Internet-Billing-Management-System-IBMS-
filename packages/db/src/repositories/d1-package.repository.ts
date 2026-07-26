import { IPackageRepository, Package } from '@ibms/core';
import { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { packages } from '../schema/packages';
import { eq } from 'drizzle-orm';

export class D1PackageRepository implements IPackageRepository {
  private db;

  constructor(d1: D1Database) {
    this.db = drizzle(d1);
  }

  async findById(id: number): Promise<Package | null> {
    const res = await this.db.select().from(packages).where(eq(packages.id, id)).get();
    if (!res) return null;
    return res;
  }

  async findAll(): Promise<Package[]> {
    return await this.db.select().from(packages);
  }

  async create(data: Omit<Package, 'id'>): Promise<Package> {
    return await this.db.insert(packages).values(data).returning().get();
  }

  async update(id: number, data: Partial<Omit<Package, 'id'>>): Promise<Package> {
    return await this.db.update(packages).set(data).where(eq(packages.id, id)).returning().get();
  }

  async delete(id: number): Promise<boolean> {
    const res = await this.db.delete(packages).where(eq(packages.id, id)).run();
    return res.success;
  }
}
