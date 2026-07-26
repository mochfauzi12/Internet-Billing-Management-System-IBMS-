import { IUserRepository, User, UserRole } from '@ibms/core';
import { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { users } from '../schema/users';
import { eq } from 'drizzle-orm';

export class D1UserRepository implements IUserRepository {
  private db;

  constructor(d1: D1Database) {
    this.db = drizzle(d1);
  }

  async findById(id: number): Promise<User | null> {
    const res = await this.db.select().from(users).where(eq(users.id, id)).get();
    if (!res) return null;
    return this.mapToEntity(res);
  }

  async findByEmail(email: string): Promise<User | null> {
    const res = await this.db.select().from(users).where(eq(users.email, email)).get();
    if (!res) return null;
    return this.mapToEntity(res);
  }

  async create(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const inserted = await this.db.insert(users).values(data).returning().get();
    return this.mapToEntity(inserted);
  }

  private mapToEntity(row: any): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.passwordHash,
      role: row.role as UserRole,
      createdAt: row.createdAt ?? '',
    };
  }
}
