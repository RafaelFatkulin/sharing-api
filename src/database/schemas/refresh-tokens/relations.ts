import { relations } from "drizzle-orm";
import { refreshTokens } from "./entity";
import { users } from "../users";

export const refreshTokenRelations = relations(refreshTokens, ({ one }) => ({
    user: one(users, {
        fields: [refreshTokens.userId],
        references: [users.id],
    }),
}))
