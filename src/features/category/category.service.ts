import Elysia, { InternalServerError, NotFoundError } from "elysia";
import { CategoryRepository } from "./category.repository";
import { trans } from "@core/locales";
import { Category, CategoryTreeItem, CreateCategory, CreateCategoryDto, UpdateCategory } from "./category.types";
import { generateSlug } from "@utils/generate-slug";

export class CategoriesService {
    constructor(private repository: CategoryRepository) { }

    async getAll({tree = false}: {tree: boolean}) {
        const categories = await this.repository.getAll()

        if(tree) {
            return this.buildCategoryTree(categories)
        }

        return categories
    }

    async buildCategoryTree(categories: Category[]) {
        const map = new Map<string, CategoryTreeItem>()
        const roots: CategoryTreeItem[] = []

        for (const category of categories) {
            map.set(category.id, {...category, children: []})
        }

        for (const category of categories) {
            const mapped = map.get(category.id)!

            if(category.parentId) {
                const parent = map.get(category.parentId)

                if(parent) {
                    parent.children!.push(mapped)
                }
            } else {
                roots.push(mapped)
            }
        }

        return roots
    }

    async getById(id: string, children?: boolean) {
        const category = await this.repository.getById(id, children)

        if(!category) {
            throw new NotFoundError(trans('categories.errors.not-found', { id }))
        }

        return category
    }

    async getBySlug(slug: string, children?: boolean) {
        const category = await this.repository.getBySlug(slug, children)

        if(!category) {
            throw new NotFoundError(trans('categories.errors.not-found-slug', { slug }))
        }

        return category
    }

    async checkCategorySlug(slug:string) {
        return await this.repository.getBySlug(slug)
    }

    async getUnique(name: string, parentId: string | null | undefined) {
        return await this.repository.getUnique(name, parentId)
    }

    async createSlug(name: string) {
        let slug = generateSlug(name);
        let counter = 1;
        const originalSlug = slug;

        while (true) {
            const slugCheck = await this.checkCategorySlug(slug);
            
            if (!slugCheck) {
                break;
            }
            
            slug = `${originalSlug}-${counter}`;
            counter++;
        }

        return slug
    }

    async create(data: CreateCategoryDto) {
        const existingCategory = await this.getUnique(data.name, data.parentId)

        if(existingCategory) {
            throw new InternalServerError(trans('categories.errors.already-exists', {
                name: existingCategory.name,
                id: existingCategory.parentId
            }))
        }

        const slug = await this.createSlug(data.name)

        const category = await this.repository.create({
            ...data,
            slug
        })

        if(!category) {
            throw new InternalServerError(trans('categories.errors.create'))
        }

        return category
    }

    async update(id: string, data: UpdateCategory) {
        const existingCategory = await this.getById(id)

        const dataToPut = {...data}

        if(!dataToPut.slug && dataToPut.name) {
            dataToPut.slug = await this.createSlug(dataToPut.name)
        }

        if(dataToPut.slug) {
            const checkSlug = await this.checkCategorySlug(dataToPut.slug)

            if(checkSlug) {
                dataToPut.slug = await this.createSlug(dataToPut.name || existingCategory.name)
            }
        }

        const category = await this.repository.update(id, {
            ...dataToPut
        })
        
        if(!category) {
            throw new InternalServerError(trans('categories.errors.update'))
        }

        return category
    }

    async delete(id: string) {
        await this.getById(id)

        const category = await this.repository.delete(id)

        if(!category) {
            throw new InternalServerError(trans('categories.errors.delete'))
        }

        return category
    } 
}

export const categoriesServicePlugin = new Elysia({ name: 'categories.service' })
    .decorate(
        'categoriesService',
        new CategoriesService(
            new CategoryRepository()
        )
    )
    .as('scoped')