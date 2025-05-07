import { db } from "@core/db";
import { Category, CategoryTreeItem, CreateCategory, UpdateCategory } from "./category.types";
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

    async getById(id: string | number, children?: boolean) {
        const category = await db.query.categories.findFirst({
            where(fields, operators) {
                return operators.eq(fields.id, String(id));
            },
            with: children ? { children: true } : undefined
        });
    
        return category ?? null;
    }
    
    async getBySlug(slug: string, children?: boolean) {
        const category = await db.query.categories.findFirst({
            where(fields, operators) {
                return operators.eq(fields.slug, slug);
            },
            with: children ? { children: true } : undefined
        });
    
        return category ?? null;
    }

    async getSubcategories(id: string) {
        const categories = await db.query.categories.findMany({
            where(fields, operators) {
                return operators.eq(fields.parentId, id)
            },
        })

        return categories ?? []
    }

    async getUnique(name: string, parentId: string | null | undefined) {
        const category = await db.query.categories.findFirst({
            where(fields, operators) {
                return operators.and(
                    operators.eq(fields.name, name),
                    parentId === null || parentId === undefined 
                        ? operators.isNull(fields.parentId)
                        : operators.eq(fields.parentId, parentId)
                );
            },
        });
    
        return category ?? null;
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