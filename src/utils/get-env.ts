import type { Context } from "hono";
import { env } from "hono/adapter";

export function getEnv(c: Context) {
    return env<{
        DATABASE_URL: string,
        AT_SECRET: string,
        RT_SECRET: string
    }>(c)
}