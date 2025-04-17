import { Elysia, t } from "elysia";
import { UsersService, usersServicePlugin } from "./users.service";
import { UsersModel } from "./users.model";
import { CoreModel } from "@core/model";
import { UsersRepository } from "./users.repository";
import { trans } from '@core/locales'
import { authMiddlewarePlugin } from "@features/auth/auth.plugin";

export const usersRoute = new Elysia({ prefix: "/users", tags: ["Users"] })
  .use(CoreModel)
  .use(UsersModel)
  .use(usersServicePlugin)
  .use(authMiddlewarePlugin(['super_admin', 'admin', 'manager']))
  .get("/", async ({ usersService, set }) => {
    set.status = 200;
    const users = await usersService.getAll()

    return {
      users,
    };
  }, {
    response: {
      200: "user.array-response"
    }
  })
  .get(
    "/:id",
    async ({ params, usersService, set }) => {
      const user = await usersService.getById(params.id);

      set.status = 200;

      return { user };
    },
    {
      params: "param.id",
      response: {
        200: "user.response",
        404: "error"
      }
    }
  )
  .post(
    "/",
    async ({ set, body, usersService }) => {
      const createdUser = await usersService.create(body);
      set.status = 201;

      return {
        user: createdUser,
      };
    },
    {
      body: "user.create",
      response: {
        201: "user.response",
      },
    }
  )
  .patch(
    "/:id",
    async ({ set, params, body, usersService }) => {
      const user = await usersService.update(params.id, body);

      set.status = 200;

      return {
        user,
        message: trans('users.messages.updated'),
      };
    },
    {
      params: "param.id",
      body: "user.update",
    }
  )
  .delete(
    "/:id",
    async ({ set, params, usersService }) => {
      const user = await usersService.delete(params.id);

      set.status = 200;

      return {
        user,
        message: trans('users.messages.updated'),
      };
    },
    {
      params: "param.id",
    }
  );
