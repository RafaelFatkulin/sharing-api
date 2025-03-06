import { relations } from "drizzle-orm";
import { rentalPointContacts } from "./entity";
import { rentalPoints } from "../rental-points";

export const rentalPointContactsRelations = relations(rentalPointContacts, ({ one }) => ({
    rentalPoint: one(rentalPoints, {
        fields: [rentalPointContacts.rentalPointId],
        references: [rentalPoints.id]
    })
}))