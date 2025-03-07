import type { z } from "@hono/zod-openapi";
import type { authResponseSchema, refreshTokenCreateSchema, refreshTokenSchema, refreshTokenUpdateSchema, signinSchema, signoutSchema, signupSchema } from "./schemas";

export type RefreshToken = z.output<typeof refreshTokenSchema>
export type RefreshTokenCreate = z.output<typeof refreshTokenCreateSchema>
export type RefreshTokenUpdate = z.output<typeof refreshTokenUpdateSchema>
export type Signup = z.output<typeof signupSchema>
export type Signin = z.output<typeof signinSchema>
export type Signout = z.output<typeof signoutSchema>
export type AuthResponse = z.output<typeof authResponseSchema>