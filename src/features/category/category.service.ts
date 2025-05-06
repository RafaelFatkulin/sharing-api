import Elysia, { InternalServerError, NotFoundError } from "elysia";
import { CategoryRepository } from "./category.repository";
import { trans } from "@core/locales";
import { CreateCategory, UpdateCategory } from "./category.types";

export class CategoriesService {
    constructor(private repository: CategoryRepository) { }

    async getAll() {
        return await this.repository.getAll()
    }

    async getById(id: string) {
        const category = await this.repository.getById(id)

        if(!category) {
            throw new NotFoundError(trans('categories.errors.not-found', { id }))
        }

        return category
    }

    async getBySlug(slug: string) {
        const category = await this.repository.getBySlug(slug)

        if(!category) {
            throw new NotFoundError(trans('categories.errors.not-found-slug', { slug }))
        }

        return category
    }

    async getUnique(name: string, parentId: string) {
        return await this.repository.getUnique(name, parentId)
    }

    async create(data: CreateCategory) {
        const existingCategory = await this.getUnique(data.name, data.parentId || '')

        if(existingCategory) {
            throw new InternalServerError(trans('categories.errors.already-exists', {
                name: existingCategory.name,
                id: existingCategory.parentId
            }))
        }

        const category = await this.repository.create(data)

        if(!category) {
            throw new InternalServerError(trans('categories.errors.create'))
        }

        return category
    }

    async update(id: string, data: UpdateCategory) {
        await this.getById(id)

        const category = await this.repository.update(id, data)
        
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