import Elysia from "elysia";
import { authPlugin } from "./auth.plugin";
import { authServicePlugin } from "./auth.service";
import { AuthModel } from "./auth.model";

export const authRoute = new Elysia({ prefix: '/auth', tags: ['Auth'] })
    .use(AuthModel)
    .use(authPlugin)
    .use(authServicePlugin)
    .post('/sign-in', async ({ set, jwt, authService, body }) => {
        const data = await authService.signin(body, jwt)
        set.status = 200

        return data
    }, {
        body: 'sign-in'
    })