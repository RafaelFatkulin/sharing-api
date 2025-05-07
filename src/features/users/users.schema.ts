import { pgTable } from "drizzle-orm/pg-core/table";
import { serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    MANAGER = 'manager',
    USER = 'user',
}

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    fullName: varchar('full_name', { length: 128 }).notNull(),
    email: varchar({ length: 128 }).unique().notNull(),
    role: text('role').$type<UserRole>().notNull(),
    password: varchar({ length: 256 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
})