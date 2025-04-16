import { password } from 'bun';
import { JWTPayloadSpec } from "@elysiajs/jwt";
import { t } from "elysia";

export type JWT = {
    readonly sign: (morePayload: Record<string, string | number> & JWTPayloadSpec) => Promise<string>;
    readonly verify: (jwt?: string) => Promise<false | (Record<string, string | number> & JWTPayloadSpec)>;
}

export const signInSchema = t.Object({
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 8, maxLength: 255 })
})