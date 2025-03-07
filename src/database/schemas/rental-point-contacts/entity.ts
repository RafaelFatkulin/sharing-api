import { integer, pgEnum, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { rentalPoints } from '../rental-points/entity'

export const contactTypeEnum = pgEnum('contact_type', ['phone', 'email', 'whatsapp', 'telegram'])

export const rentalPointContacts = pgTable('rental-point-contacts', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  rentalPointId: integer('rental_point_id').notNull().references(() => rentalPoints.id, { onDelete: 'cascade' }),
  contactType: contactTypeEnum('contact_type').notNull(),
  value: varchar('value', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
