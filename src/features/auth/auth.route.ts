import Elysia from "elysia";
import { authMiddlewarePlugin, jwtPlugin } from "./auth.plugin";
import { authServicePlugin } from "./auth.service";
import { AuthModel } from "./auth.model";
import { trans } from "@core/locales";

export const authRoute = new Elysia({ prefix: "/auth", tags: ["Auth"] })
  .use(AuthModel)
  .use(jwtPlugin)
  .use(authServicePlugin)
  .post(
    "/sign-in",
    async ({ set, jwt, refreshJwt, authService, body }) => {
      const data = await authService.signin(body, jwt, refreshJwt);
      set.status = 200;

      return data;
    },
    {
      body: "sign-in",
    }
  )
  .post(
    '/sign-up',
    async ({ set, authService, body }) => {
      const data = await authService.signup(body)
      set.status = 201

      return {
        user: data,
        message: trans("auth.messages.register.successfull")
      }
    },
    {
      body: 'sign-up',
      response: {
        200: 'sign-up.response'
      }
    }
  )
  .post(
    '/refresh',
    async ({ set, authService, body, jwt, refreshJwt }) => {
      const data = await authService.refresh(body.refreshToken, jwt, refreshJwt)
      set.status = 200

      return {
        ...data
      }
    },
    {
      body: 'refresh',
      response: {
        200: 'refresh.response'
      }
    }
  )
  .use(authMiddlewarePlugin(['super_admin']))
  .get('/me', ({ user }) => ({ user }), {
    detail: {
      security: [
        { bearerAuth: [] }
      ]
    }
  })
