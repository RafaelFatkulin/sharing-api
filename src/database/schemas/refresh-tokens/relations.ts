import { relations } from 'drizzle-orm'
import { users } from '../users'
import { refreshTokens } from './entity'

export const refreshTokenRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}))
