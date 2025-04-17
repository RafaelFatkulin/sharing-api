import { password } from 'bun';
import { JWTPayloadSpec } from "@elysiajs/jwt";
import { t } from "elysia";
import { rolesEnum } from '@features/users/users.schema';
import { userResponseSchema } from '@features/users/users.types';

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
    role: t.Optional(t.UnionEnum(rolesEnum.enumValues)),
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
    accessToken: t.String(),
    refreshToken: t.String(),
})

export type SignIn = typeof signInSchema.static
export type SignUp = typeof signUpSchema.static