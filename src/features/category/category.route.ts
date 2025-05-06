import { CoreModel } from "@core/model";
import Elysia, { t } from "elysia";
import { CategoriesModel } from "./category.model";
import { categoriesServicePlugin } from "./category.service";
import { trans } from "@core/locales";

export const categoriesRoute = new Elysia({
    prefix: '/categories',
    tags: ['Categories']
})
    .use(CoreModel)
    .use(CategoriesModel)
    .use(categoriesServicePlugin)
    .get('/', async ({query, categoriesService, set}) => {
        const { tree } = query

        const categories = categoriesService.getAll({
            tree: !!tree
        })

        set.status = 200

        return categories
    }, {
        query: 'category.filter',
        response: {
            200: "category.response[]"
        }
    })
    .get(
        '/:id',
        async ({params, categoriesService, set}) => {
            const category = await categoriesService.getById(params.id)
            set.status = 200

            return category
        },
        {
            params: 'param.string-id',
            response: {
                200: 'category.response',
                404: 'error'
            }   
        }
    )
    .get(
        '/slug/:slug',
        async ({params, categoriesService, set}) => {
            const category = await categoriesService.getBySlug(params.slug)
            set.status = 200

            return category
        }, {
            params: 'param.slug',
            response: { 
                200: 'category.response',
                404: 'error'
            }
        }
    )
    .post(
        '/',
        async ({ set, body, categoriesService }) => {
            const category = await categoriesService.create(body)
            set.status = 201

            return category
        }, {
            body: 'category.create',
            response: {
                201: 'category.response'
            }
        }
    )
    .patch(
        '/:id',
        async ({ set, params, body, categoriesService }) => {
            const category = await categoriesService.update(params.id, body)
            set.status = 200

            return {
                category,
                message: trans('categories.messages.updated')
            }
        }, {
            params: 'param.string-id',
            body: 'category.update'
        }
    )
    .delete(
        '/:id',
        async ({ set, params, categoriesService }) => {
            const category = categoriesService.delete(params.id)
            set.status = 200

            return {
                category,
                message: trans('categories.messages.deleted')
            }
        }, {
            params: 'param.string-id'
        }
    )