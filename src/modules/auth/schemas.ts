import { table } from "@database/schemas";
import { userCreateSchema } from "@modules/users/schemas";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "@hono/zod-openapi";
import { emailField, stringField } from "@utils/zod";

export const refreshTokenSchema = createSelectSchema(table.refreshTokens).openapi('Refresh token schema')
export const refreshTokenCreateSchema = createInsertSchema(table.refreshTokens).openapi('Refresh token create schema')
export const refreshTokenUpdateSchema = createUpdateSchema(table.refreshTokens).openapi('Refresh token update schema')

export const signupSchema = userCreateSchema.openapi('Signup schema')

export const signinSchema = z.object({
    email: emailField().openapi({ example: 'ivanov_i@vk.com' }),
    password: stringField(8, 64).openapi({ example: 'password' })
})

export const signoutSchema = z.object({
    refreshToken: z.string().optional()
}).openapi('Signout schema')

export const refreshSchema = signoutSchema.openapi('Refresh schema')

export const authResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    accessExpiresAt: z.date(),
    refreshExpiresAt: z.date(),
})