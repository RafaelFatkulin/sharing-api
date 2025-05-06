import Elysia from "elysia";
import { 
  ErrorSchema, 
  IdParamSchema, 
  IdStringParamSchema, 
  SlugParamSchema 
} from "./schema";

export const CoreModel = new Elysia().model({
  "param.id": IdParamSchema,
  "param.string-id": IdStringParamSchema,
  'param.slug': SlugParamSchema,
  "error": ErrorSchema
});
