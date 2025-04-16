import { Elysia, t } from "elysia";
import { UsersService } from "./users.service";
import { UsersModel } from "./users.model";
import { CoreModel } from "@core/model";
import { UsersRepository } from "./users.repository";
import { trans } from '@core/locales'

export const usersRoute = new Elysia({ prefix: "/users", tags: ["Users"] })
  .use(CoreModel)
  .use(UsersModel)
  .decorate("service", new UsersService(new UsersRepository()))
  .get("/", async ({ service, set }) => {
    set.status = 200;
    const users = await service.getAll()

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
    async ({ params, service, set }) => {
      const user = await service.getById(params.id);

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
    async ({ set, body, service }) => {
      const user = await service.create(body);
      set.status = 201;

      return {
        user,
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
    async ({ set, params, body, service }) => {
      const user = await service.update(params.id, body);

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
    async ({ set, params, service }) => {
      const user = await service.delete(params.id);

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
