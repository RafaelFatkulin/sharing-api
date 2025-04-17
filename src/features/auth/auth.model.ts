import Elysia from "elysia";
import { refreshResponseSchema, refreshSchema, signInSchema, signUpResponseSchema, signUpSchema } from "./auth.types";

export const AuthModel = new Elysia().model({
    'sign-in': signInSchema,
    'sign-up': signUpSchema,
    'refresh': refreshSchema,
    'sign-up.response': signUpResponseSchema,
    'refresh.response': refreshResponseSchema,
}).as('scoped')