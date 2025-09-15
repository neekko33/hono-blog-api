import { desc } from 'drizzle-orm'
import { integer, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 256 }).notNull(),
  email: varchar({ length: 256 }).notNull().unique(),
  bio: varchar({ length: 512 }),
  password: varchar({ length: 256 }).notNull(),
  avatar_url: varchar({ length: 512 }),
  created_at: timestamp({ mode: 'date' }).defaultNow().notNull(),
  updated_at: timestamp({ mode: 'date' }).defaultNow().notNull(),
})

export const categoriesTable = pgTable('categories', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 256 }).notNull().unique(),
  created_at: timestamp({ mode: 'date' }).defaultNow().notNull(),
  updated_at: timestamp({ mode: 'date' }).defaultNow().notNull(),
})

export const tagsTable = pgTable('tags', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 256 }).notNull().unique(),
  created_at: timestamp({ mode: 'date' }).defaultNow().notNull(),
  updated_at: timestamp({ mode: 'date' }).defaultNow().notNull(),
})

export const postsTable = pgTable('posts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 512 }).notNull(),
  description: varchar({ length: 1024 }).notNull(),
  content: varchar({ length: 2048 }).notNull(),
  author_id: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  category_id: integer()
    .notNull()
    .references(() => categoriesTable.id, { onDelete: 'set null', onUpdate: 'cascade' }),
  created_at: timestamp({ mode: 'date' }).defaultNow().notNull(),
  updated_at: timestamp({ mode: 'date' }).defaultNow().notNull(),
})

// Join table for posts and tags (many-to-many)
export const postsTagsTable = pgTable('posts_tags', {
  post_id: integer()
    .notNull()
    .references(() => postsTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  tag_id: integer()
    .notNull()
    .references(() => tagsTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  created_at: timestamp({ mode: 'date' }).defaultNow().notNull(),
  updated_at: timestamp({ mode: 'date' }).defaultNow().notNull(),
})