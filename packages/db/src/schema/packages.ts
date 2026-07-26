import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const packages = sqliteTable('packages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  speed: text('speed').notNull(),
  price: integer('price').notNull(),
  description: text('description'),
});
