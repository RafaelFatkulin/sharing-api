import { db } from "@core/db";
import { Category, CreateCategory, UpdateCategory } from "./category.types";
import { categories } from "./category.schema";
import { eq, Update } from "drizzle-orm";

interface ICategoryRepository extends BaseRepository<
    Category,
    CreateCategory,
    UpdateCategory
>{
    getBySlug: (slug: string) => Promise<Category | null>
}

export class CategoryRepository implements ICategoryRepository {
    async getAll() {
        const categories = await db.query.categories.findMany({
            orderBy(fields, operators) {
                return operators.desc(fields.createdAt)
            },
        })

        return categories ?? []
    }

    async getById(id: string | number) {
        const category = await db.query.categories.findFirst({
            where(fields, operators) {
                return operators.eq(categories.id, String(id))
            },
        })

        return category ?? null
    }

    async getBySlug(slug: string) {
        const category = await db.query.categories.findFirst({
            where(fields, operators) {
                return operators.eq(categories.slug, slug)
            },
        })

        return category ?? null
    }

    async getUnique(name: string, parentId: string) {
        const category = await db.query.categories.findFirst({
            where(fields, operators) {
                return operators.and(
                    operators.eq(categories.name, name),
                    operators.eq(categories.parentId, parentId),
                )
            },
        })

        return category ?? null
    }

    async create(data: CreateCategory) {
        return db.transaction(async (tx) => {
            const [category] = await tx
                .insert(categories)
                .values(data)
                .returning()

            return category ?? null
        })
    }

    async update(id: string | number, data: UpdateCategory) {
        return db.transaction(async (tx) => {
            const [category] = await tx
                .update(categories)
                .set(data)
                .where(eq(categories.id, String(id)))
                .returning()

            return category ?? null
        })
    }

    async delete(id: string | number) {
        return db.transaction(async (tx) => {
            const [category] = await tx
                .delete(categories)
                .where(eq(categories.id, String(id)))
                .returning()

            return category ?? null
        })
    }
}