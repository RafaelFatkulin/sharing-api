import { createRoute, z } from '@hono/zod-openapi'
import { TAGS, PATHS } from './constants'
import { userCreateSchema, userSchema, usersFilterSchema, userUpdateSchema } from './schemas'
import { HttpStatusCodes } from '@utils/status-codes'
import { jsonContent } from '@helpers/json-content'
import { errorResponseSchema, getSuccessResponseSchema } from '@utils/response'
import { IdParamsSchema } from '@utils/zod'
import { jsonContentRequired } from '@helpers/json-content-required'

const list = createRoute({
    tags: TAGS,
    path: PATHS.root,
    method: 'get',
    summary: 'Get a list of users',
    description: 'Fetches a list of users based on optional filter parameters provided in the query string.',
    request: { query: usersFilterSchema },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            getSuccessResponseSchema(z.array(userSchema)),
            'The list of users'
        ),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(
            errorResponseSchema,
            'Error when getting the list of users'
        )
    }
})

const get = createRoute({
    tags: TAGS,
    path: PATHS.id(),
    method: 'get',
    summary: 'Get user by ID',
    description: 'Fetches the details of a user identified by their unique ID.',
    request: {
        params: IdParamsSchema
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            getSuccessResponseSchema(userSchema),
            'User successfully found',
        ),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(
            errorResponseSchema,
            'User not found',
        ),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(
            errorResponseSchema,
            'Error when getting a user',
        ),
    }
})

const create = createRoute({
    tags: TAGS,
    path: PATHS.create(),
    method: 'post',
    summary: 'Create a new user',
    description: 'Creates a new user with the provided data. Requires admin privileges.',
    request: {
        body: jsonContentRequired(userCreateSchema, 'User\'s data to create')
    },
    responses: {
        [HttpStatusCodes.CREATED]: jsonContent(
            getSuccessResponseSchema(userSchema),
            'User successfully created',
        ),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(
            errorResponseSchema,
            'Error when creating a user',
        ),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
            errorResponseSchema,
            'Error when creating a user',
        ),
    }
})

const update = createRoute({
    tags: TAGS,
    path: PATHS.update(),
    method: 'patch',
    summary: 'Update a user',
    description: 'Modifies the details of an existing user identified by their unique ID. Requires appropriate permissions.',
    request: {
        params: IdParamsSchema,
        body: jsonContentRequired(userUpdateSchema, 'User\'s data to update')
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            getSuccessResponseSchema(userSchema),
            'User successfully updated',
        ),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(
            errorResponseSchema,
            'User not found',
        ),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(
            errorResponseSchema,
            'Error when updating a user',
        ),
    }
})

const remove = createRoute({
    tags: TAGS,
    path: PATHS.remove(),
    method: 'delete',
    summary: 'Delete a user',
    description: 'Removes a user identified by their unique ID from the system. Requires appropriate permissions.',
    request: {
        params: IdParamsSchema
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            getSuccessResponseSchema(userSchema),
            'User successfully deleted',
        ),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(
            errorResponseSchema,
            'User not found',
        ),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(
            errorResponseSchema,
            'Error when deleting a user',
        ),
    }
})

export const routes = {
    list,
    get,
    create,
    update,
    remove
}

export type List = typeof list
export type Get = typeof get
export type Create = typeof create
export type Update = typeof update
export type Remove = typeof remove