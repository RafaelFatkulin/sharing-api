import Elysia, { t } from "elysia";
import { categorySchema, categoryTreeItemSchema, createCategoryDtoSchema, updateCategorySchema } from "./category.types";

export const CategoriesModel = new Elysia()
    .model({
        category: categorySchema,
        'category.filter': t.Object({
            tree: t.Optional(t.Boolean()),
        }),
        'category.response': categorySchema,
        'category.array-response': t.Array(t.Union([categorySchema, categoryTreeItemSchema])),
        'category.create': createCategoryDtoSchema,
        'category.update': updateCategorySchema
    })