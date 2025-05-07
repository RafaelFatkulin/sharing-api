import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-typebox";
import { categories } from "./category.schema";
import { t } from "elysia";

const _category = createSelectSchema(categories)
const _createCategory = createInsertSchema(categories, {
    name: t.String({minLength: 4, maxLength: 255}),
    slug: t.String({minLength: 4, maxLength: 255}),
})
const _updateCategory = createUpdateSchema(categories, {
    name: t.String({minLength: 4, maxLength: 255}),
    slug: t.String({minLength: 4, maxLength: 255}),
})

export const categorySchema = _category
export const categoryTreeItemSchema = t.Recursive((Self) =>
    t.Object({
      ..._category.properties,
      children: t.Optional(t.Array(Self))
    })
  )
export const createCategorySchema = t.Omit(_createCategory, ['id', 'createdAt'])
export const createCategoryDtoSchema = t.Omit(createCategorySchema, ['slug'])
export const updateCategorySchema = t.Omit(t.Partial(_updateCategory), ['id', 'createdAt'])

export type Category = typeof categorySchema.static
export type CategoryTreeItem = typeof categoryTreeItemSchema.static
export type CreateCategory = typeof createCategorySchema.static
export type CreateCategoryDto = typeof createCategoryDtoSchema.static
export type UpdateCategory = typeof updateCategorySchema.static