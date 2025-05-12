import { password } from 'bun';
import { JWTPayloadSpec } from "@elysiajs/jwt";
import { t } from "elysia";
import { userResponseSchema } from '@features/users/users.types';
import { UserRole } from '@features/users/users.schema';

export type JWT = {
    readonly sign: (morePayload: Record<string, string | number> & JWTPayloadSpec) => Promise<string>;
    readonly verify: (jwt?: string) => Promise<false | (Record<string, string | number> & JWTPayloadSpec)>;
}

export const signInSchema = t.Object({
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 8, maxLength: 255 })
})

export const signUpSchema = t.Object({
    fullName: t.String({ minLength: 8, maxLength: 255 }),
    email: t.String({ format: "email" }),
    role: t.Optional(t.Enum(UserRole)),
    password: t.String({ minLength: 8, maxLength: 255 }),
})

export const refreshSchema = t.Object({
    refreshToken: t.String()
})

export const signUpResponseSchema = t.Object({
    user: userResponseSchema,
    message: t.String()
})

export const refreshResponseSchema = t.Object({
    message: t.String()
})

export type SignIn = typeof signInSchema.static
export type SignUp = typeof signUpSchema.static