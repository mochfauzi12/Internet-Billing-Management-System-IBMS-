import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { invoices } from './invoices';

export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  invoiceId: integer('invoice_id').references(() => invoices.id),
  paymentDate: text('payment_date').notNull(),
  paymentMethod: text('payment_method').notNull(),
  amount: integer('amount').notNull(),
  note: text('note'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
});
