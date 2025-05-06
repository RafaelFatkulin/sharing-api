import Elysia, { t } from "elysia";
import { categorySchema, createCategorySchema, updateCategorySchema } from "./category.types";

export const CategoriesModel = new Elysia()
    .model({
        category: categorySchema,
        'category.response': categorySchema,
        'category.array-response': t.Array(categorySchema),
        'category.create': createCategorySchema,
        'category.update': updateCategorySchema
    })