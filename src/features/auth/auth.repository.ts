import { db } from "@core/db";
import { refreshTokens } from "./auth.schema";
import { eq } from "drizzle-orm";

export class AuthRepository {
  async createRefreshToken(userId: number, token: string) {
    const [refreshToken] = await db
      .insert(refreshTokens)
      .values({
        userId,
        token,
        expiresAt: new Date(Date.now() + 7 * 25 * 60 * 60 * 1000),
      })
      .returning();

    return refreshToken;
  }

  async getRefreshToken(token: string) {
    const [refreshToken] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token));

    return refreshToken;
  }

  async deleteRefreshToken(token: string) {
    const [refreshToken] = await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.token, token))
      .returning();

    return refreshToken;
  }

  async deleteAllRefreshTokens(userId: number) {
    return await db.transaction(async (tx) => {
      const tokens = await tx.delete(refreshTokens).where(eq(refreshTokens.userId, userId)).returning()

      return tokens ?? []
    })
  }
}
