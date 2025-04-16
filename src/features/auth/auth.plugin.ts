import { jwtConfig } from "@core/config";
import { UnauthorizedError } from "@core/core.errors";
import jwt from "@elysiajs/jwt";
import { UsersRepository } from "@features/users/users.repository";
import { UsersService } from "@features/users/users.service";
import Elysia from "elysia";

export const authPlugin = new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: jwtConfig.secret,
        })
    )
    .decorate("service", new UsersService(new UsersRepository()))
    .derive(async ({ jwt, set, service, request }) => {
        const authorization = request.headers.get('Authorization')

        if (!authorization) {
            set.status = 401
            throw new UnauthorizedError('Unauthorized')
        }

        const token = authorization.split(' ')[1]

        if (!token) {
            set.status = 401
            throw new UnauthorizedError('Unauthorized')
        }

        const payload = await jwt.verify(token);

        if (!payload) {
            set.status = 401
            throw new UnauthorizedError('Unauthorized')
        }

        const { id } = payload

        const user = await service.getById(Number(id))

        if (!user) {
            set.status = 401
            throw new UnauthorizedError('Unauthorized')
        }

        return {
            user
        }
    })