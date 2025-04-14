import Elysia from "elysia";
import { IdParamSchema } from "./schema";

export const CoreModel = new Elysia().model({
  "param.id": IdParamSchema,
});
