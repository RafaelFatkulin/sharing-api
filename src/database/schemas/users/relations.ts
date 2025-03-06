import { relations } from "drizzle-orm";
import { users } from "./entity";
import { refreshTokens } from "../refresh-tokens";

export const userRelations = relations(users, ({ many }) => ({
    refreshTokens: many(refreshTokens),
}))
