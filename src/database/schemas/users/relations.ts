import { relations } from 'drizzle-orm'
import { refreshTokens } from '../refresh-tokens'
import { users } from './entity'

export const userRelations = relations(users, ({ many }) => ({
  refreshTokens: many(refreshTokens),
}))
