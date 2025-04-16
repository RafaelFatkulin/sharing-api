import Elysia from "elysia";
import { signInSchema } from "./auth.types";

export const AuthModel = new Elysia().model({
    'sign-in': signInSchema
}).as('scoped')