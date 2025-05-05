import Elysia from "elysia";
import { ErrorSchema, IdParamSchema, IdStringParamSchema } from "./schema";

export const CoreModel = new Elysia().model({
  "param.id": IdParamSchema,
  "param.string-id": IdStringParamSchema,
  "error": ErrorSchema
});
