import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const wireframes = sqliteTable('wireframes', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  document: text('document').notNull(),
  updatedAt: integer('updated_at').notNull()
}, table => [index('wireframes_user_updated_idx').on(table.userId, table.updatedAt)]);
