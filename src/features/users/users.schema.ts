import { pgEnum } from "drizzle-orm/pg-core/columns/enum";
import { pgTable } from "drizzle-orm/pg-core/table";
import { serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum(
    'role', [
        'super_admin',
        'admin',
        'manager',
        'user'
    ]
)

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    fullName: varchar('full_name', { length: 128 }).notNull(),
    email: varchar({ length: 128 }).unique().notNull(),
    role: rolesEnum().default('user').notNull(),
    password: varchar({ length: 256 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
})