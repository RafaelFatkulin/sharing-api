import { table } from "@database/schemas";
import type { RefreshTokenCreate } from "./types";
import { db } from "@database";
import { eq, type SQL } from "drizzle-orm";

export async function createRefrehToken(data: RefreshTokenCreate) {
    return await db
        .insert(table.refreshTokens)
        .values(data)
        .returning()
}

export async function getRefreshToken(token: string, revoked?: boolean) {
    return db.query.refreshTokens.findFirst({
        where(fields, { eq, and }) {
            const conditions: SQL[] = []

            conditions.push(eq(fields.token, token))

            if (revoked) {
                conditions.push(eq(fields.revoked, revoked))
            }

            return conditions.length ? and(...conditions) : undefined
        },
    })
}

export async function revokeRefreshToken(id: number) {
    return await db
        .update(table.refreshTokens)
        .set({ revoked: true })
        .where(eq(table.refreshTokens.id, id))
        .returning()
}