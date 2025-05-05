import { users } from "@features/users/users.schema";
import { integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export enum ProfileType {
    INDIVIDUAL = 'individual',
    ORGANIZATION = 'organization'
}

export const renterProfiles = pgTable('renter_profiles', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: integer("user_id").references(() => users.id, {
        onDelete: "cascade",
    }).notNull(),
    type: text('type').$type<ProfileType>().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    contactPhone: varchar('contact_phone', {length: 20}).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    taxId: varchar('tax_id', {length: 13}),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
})