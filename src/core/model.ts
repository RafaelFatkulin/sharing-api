import Elysia from "elysia";
import { ErrorSchema, IdParamSchema } from "./schema";

export const CoreModel = new Elysia().model({
  "param.id": IdParamSchema,
  "error": ErrorSchema
});
