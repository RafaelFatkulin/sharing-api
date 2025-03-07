import { relations } from 'drizzle-orm'
import { rentalPoints } from '../rental-points'
import { rentalPointContacts } from './entity'

export const rentalPointContactsRelations = relations(rentalPointContacts, ({ one }) => ({
  rentalPoint: one(rentalPoints, {
    fields: [rentalPointContacts.rentalPointId],
    references: [rentalPoints.id],
  }),
}))
