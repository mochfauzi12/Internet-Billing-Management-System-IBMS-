import { sqliteTable, integer, text, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { customers } from './customers';

export const invoices = sqliteTable('invoices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  invoiceNumber: text('invoice_number').unique().notNull(),
  customerId: integer('customer_id').references(() => customers.id),
  packagePrice: integer('package_price').notNull(),
  billingMonth: integer('billing_month').notNull(),
  billingYear: integer('billing_year').notNull(),
  dueDate: text('due_date').notNull(),
  total: integer('total').notNull(),
  status: text('status', { enum: ['unpaid', 'paid', 'late'] }).default('unpaid'),
  pdfR2Key: text('pdf_r2_key'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
}, (table) => ({
  unq: unique().on(table.customerId, table.billingMonth, table.billingYear),
}));
