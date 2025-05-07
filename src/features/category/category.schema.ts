import { relations } from "drizzle-orm";
import { AnyPgColumn, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const categories = pgTable('categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    parentId: uuid('parent_id').references((): AnyPgColumn => categories.id, {
        onDelete: "cascade"
    }),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
})

export const categoriesRelations = relations(categories, ({ one, many }) => ({
    parent: one(categories, {
      fields: [categories.parentId],
      references: [categories.id],
      relationName: "parent",
    }),
    children: many(categories, {
      relationName: "parent",
    }),
  }));