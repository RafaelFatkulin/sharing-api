import Elysia, { t } from "elysia";
import {
  createUserSchema,
  updateUserSchema,
  userQuerySchema,
  userResponseSchema,
  userSchema,
} from "./users.types";
import { MetaSchema } from "@core/schema";

export const UsersModel = new Elysia().model({
  user: userSchema,
  "users.filter": userQuerySchema,
  "user.create": createUserSchema,
  "user.update": updateUserSchema,
  "user.response": t.Object({
    user: userResponseSchema,
  }),
  "user.array-response": t.Object({
    users: t.Array(userResponseSchema),
    meta: MetaSchema,
  })
}).as('scoped');
