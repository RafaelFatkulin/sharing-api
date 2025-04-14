import Elysia, { t } from "elysia";
import {
  createUserSchema,
  updateUserSchema,
  userResponseSchema,
  userSchema,
} from "./types";

export const UsersModel = new Elysia().model({
  user: userSchema,
  "user.create": createUserSchema,
  "user.update": updateUserSchema,
  "user.response": t.Object({
    user: userResponseSchema,
  }),
});
