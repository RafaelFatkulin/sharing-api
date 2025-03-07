import { relations } from 'drizzle-orm'
import { rentalPointContacts } from '../rental-point-contacts'
import { users } from '../users'
import { rentalPoints } from './entity'

export const rentalPointsRelations = relations(rentalPoints, ({ one, many }) => ({
  owner: one(users, {
    fields: [rentalPoints.ownerId],
    references: [users.id],
  }),
  contacts: many(rentalPointContacts),
}))
