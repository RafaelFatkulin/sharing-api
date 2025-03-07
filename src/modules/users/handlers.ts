import type { AppRouteHandler } from "types"
import type { Get, List, Create, Update, Remove } from "./routes"
import { createUser, deleteUser, getUser, getUserByEmail, getUsers, updateUser } from "./services"
import { createErrorResponse, createSuccessResponse } from "@utils/response"
import { HttpStatusCodes } from "@utils/status-codes"

const list: AppRouteHandler<List> = async (c) => {
    const filters = c.req.valid('query')

    try {
        const { data, meta, message } = await getUsers(filters)

        return c.json(
            createSuccessResponse({
                data,
                meta,
                message
            }),
            HttpStatusCodes.OK
        )
    } catch {
        return c.json(
            createErrorResponse({
                message: 'Ошибка при загрузке пользователей'
            }),
            HttpStatusCodes.BAD_REQUEST
        )
    }
}
const get: AppRouteHandler<Get> = async (c) => {
    const { id } = c.req.valid('param')

    try {
        const user = await getUser(id)

        if (!user) {
            return c.json(
                createErrorResponse({
                    message: 'Пользователь не найден'
                }),
                HttpStatusCodes.NOT_FOUND
            )
        }

        return c.json(
            createSuccessResponse({ data: user }),
            HttpStatusCodes.OK
        )
    } catch {
        return c.json(
            createErrorResponse({
                message: 'Ошибка при загрузке пользователя'
            }),
            HttpStatusCodes.BAD_REQUEST
        )
    }
}
const create: AppRouteHandler<Create> = async (c) => {
    const data = c.req.valid('json')

    const existingUser = await getUserByEmail(data.email)

    if (existingUser) {
        return c.json(
            createErrorResponse({
                message: `Пользователь с почтой ${data.email} уже существует`
            }),
            HttpStatusCodes.BAD_REQUEST
        )
    }

    try {
        const [user] = await createUser(data)

        return c.json(
            createSuccessResponse({
                message: `Пользователь ${user.fullName} создан`,
                data: user
            }),
            HttpStatusCodes.CREATED
        )
    } catch {
        return c.json(
            createErrorResponse({
                message: 'Ошибка при создании пользователя'
            }),
            HttpStatusCodes.BAD_REQUEST
        )
    }
}
const update: AppRouteHandler<Update> = async (c) => {
    const { id } = c.req.valid('param')
    const data = c.req.valid('json')
    const existingUser = await getUser(id)

    if (!existingUser) {
        return c.json(
            createErrorResponse({
                message: 'Пользователь не существует',
            }),
            HttpStatusCodes.NOT_FOUND,
        )
    }

    try {
        const [updatedUser] = await updateUser(id, data)

        return c.json(
            createSuccessResponse({
                message: `Информация о пользователе обновлена`,
                data: updatedUser,
            }),
            HttpStatusCodes.OK,
        )
    }
    catch {
        return c.json(
            createErrorResponse({
                message: 'Ошибка при редактировании пользователя',
            }),
            HttpStatusCodes.BAD_REQUEST,
        )
    }
}
const remove: AppRouteHandler<Remove> = async (c) => {
    const { id } = c.req.valid('param')

    const existingUser = await getUser(id)

    if (!existingUser) {
        return c.json(
            createErrorResponse({
                message: 'Пользователь не существует',
            }),
            HttpStatusCodes.NOT_FOUND,
        )
    }

    try {
        const [user] = await deleteUser(id)

        return c.json(
            createSuccessResponse({
                message: `Пользователь ${user.fullName} удален`,
                data: user,
            }),
            HttpStatusCodes.OK,
        )
    } catch {
        return c.json(
            createErrorResponse({ message: 'Ошибка при удалении пользователя' }),
            HttpStatusCodes.BAD_REQUEST,
        )
    }
}

export const handlers = {
    list,
    get,
    create,
    update,
    remove
}