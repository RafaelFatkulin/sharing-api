import { Elysia, t } from "elysia";
import { UsersService } from "./users.service";
import { UsersModel } from "./users.model";
import { CoreModel } from "@core/model";
import { UsersRepository } from "./users.repository";

export const usersRoute = new Elysia({ prefix: "/users" })
  .use(CoreModel)
  .use(UsersModel)
  .decorate("service", new UsersService(new UsersRepository()))
  .get(
    "/",
    async ({ service, set }) => {
      set.status = 200;

      return {
        users: await service.getAll(),
      };
    },
    {
      response: {
        200: "user.response[]",
      },
    }
  )
  .get(
    "/:id",
    async ({ params, service, set, error }) => {
      const user = await service.getById(Number(params.id));

      return {
        user,
      };
    },
    {
      params: "param.id",
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
  );
