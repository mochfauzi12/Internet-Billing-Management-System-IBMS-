import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { packages } from './packages';

export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  customerCode: text('customer_code').unique().notNull(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  address: text('address'),
  packageId: integer('package_id').references(() => packages.id),
  status: text('status', { enum: ['active', 'suspend', 'stopped'] }).default('active'),
  subscribedAt: text('subscribed_at'),
  note: text('note'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
});
