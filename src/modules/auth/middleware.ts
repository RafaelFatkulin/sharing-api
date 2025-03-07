import { getUser, type User } from "@modules/users";
import { getEnv } from "@utils/get-env";
import { createErrorResponse } from "@utils/response";
import { HttpStatusCodes } from "@utils/status-codes";
import { password } from "bun";
import type { Context, Next } from "hono";
import { verify } from "hono/jwt";

export async function authMiddleware(
    c: Context,
    next: Next,
    requiredRoles?: User['role']
) {
    if (!c) {
        throw new Error('Context is undefined')
    }

    const token = c.req.header('Authorization')?.split(' ')[1]

    if (!token) {
        return c.json(
            createErrorResponse({ message: 'Токен авторизации не передан' }),
            HttpStatusCodes.UNAUTHORIZED
        )
    }

    let decoded;

    try {
        decoded = await verify(token, getEnv(c).AT_SECRET, 'HS256')
    } catch {
        return c.json(
            createErrorResponse({ message: 'Токен недействителен' }),
            HttpStatusCodes.UNAUTHORIZED
        )
    }

    const user = await getUser(Number(decoded.id))

    if (!user) {
        return c.json(
            createErrorResponse({ message: 'Доступ запрещен' }),
            HttpStatusCodes.FORBIDDEN
        )
    }

    if (requiredRoles && !requiredRoles.includes(user.role)) {
        return c.json(
            createErrorResponse({ message: 'Доступ запрещен' }),
            HttpStatusCodes.FORBIDDEN
        )
    }

    c.set('user', {
        ...user,
        password: undefined,
        createdAt: undefined,
        updatedAt: undefined
    })

    return next()
}