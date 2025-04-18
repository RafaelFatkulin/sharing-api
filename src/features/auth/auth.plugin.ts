import { UserResponse, UserRole } from './../users/users.types';
import { jwtConfig } from "@core/config";
import { ForbiddenError, UnauthorizedError } from "@core/core.errors";
import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import {
  usersServicePlugin,
} from "@features/users/users.service";
import Elysia from "elysia";

export const jwtPlugin = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: jwtConfig.secret,
      exp: '15m'
    })
  )
  .use(
    jwt({
      name: "refreshJwt",
      secret: jwtConfig.refreshSecret,
      exp: '7d'
    })
  )

export const authMiddlewarePlugin = (reqiredRoles?: UserRole[]) => new Elysia()
  .use(bearer())
  .use(
    jwt({
      name: "jwt",
      secret: jwtConfig.secret,
      exp: '15m'
    })
  )
  .use(usersServicePlugin)
  .derive(async ({ jwt, set, bearer, usersService }) => {
    if (!bearer) {
      set.status = 401;
      throw new UnauthorizedError("Unauthorized");
    }

    const payload = await jwt.verify(bearer);

    if (!payload) {
      set.status = 401;
      throw new UnauthorizedError("Unauthorized");
    }

    const { id } = payload;

    const user = await usersService.getById(Number(id));

    if (!user) {
      set.status = 401;
      throw new UnauthorizedError("Unauthorized");
    }
    console.log(reqiredRoles);

    if (reqiredRoles && !reqiredRoles.includes(user.role)) {
      set.status = 403
      throw new ForbiddenError("Forbidden")
    }

    return {
      user: user,
    };
  }).as('plugin');