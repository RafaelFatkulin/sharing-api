import { relations } from "drizzle-orm";
import { rentalPoints } from "./entity";
import { users } from "../users";
import { rentalPointContacts } from "../rental-point-contacts";

export const rentalPointsRelations = relations(rentalPoints, ({ one, many }) => ({
    owner: one(users, {
        fields: [rentalPoints.ownerId],
        references: [users.id]
    }),
    contacts: many(rentalPointContacts)
}))