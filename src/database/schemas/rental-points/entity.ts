import { boolean, decimal, integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { users } from '../users'

export const rentalPoints = pgTable('rental_points', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  ownerId: integer('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address').notNull(),
  let: decimal('lat'),
  lng: decimal('lng'),
  phone: varchar('phone', { length: 20 }),
  website: varchar('website', { length: 255 }),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})
