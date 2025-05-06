import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-typebox";
import { ProfileType, renterProfiles } from "./renter-profile.schema";
import { t } from "elysia";

const _renterProfile = createSelectSchema(renterProfiles)
const _createRenterProfile = createInsertSchema(renterProfiles, {
    name: t.String({minLength: 8, maxLength: 255}),
    email: t.String({format: 'email'}),
    type: t.Enum(ProfileType),
    contactPhone: t.String({minLength: 11, maxLength: 20, pattern: String.raw`^(?:\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$`}),
    taxId: t.Optional(t.String({maxLength: 13})),
    description: t.Optional(t.String())
})
const _updateRenterProfile = createUpdateSchema(renterProfiles, {
    name: t.String({minLength: 8, maxLength: 255}),
    email: t.String({format: 'email'}),
    type: t.Enum(ProfileType),
    contactPhone: t.String({minLength: 11, maxLength: 20, pattern: String.raw`^(?:\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$`}),
    taxId: t.Optional(t.String({maxLength: 13}))
})

export const renterProfileSchema = _renterProfile
export const createRenterProfileSchema = t.Omit(_createRenterProfile, ['id', 'createdAt'])
export const updateRenterProfileSchema = t.Omit(t.Partial(_updateRenterProfile), ['id', 'createdAt'])

export type RenterProfile = typeof renterProfileSchema.static
export type CreateRenterProfile = typeof createRenterProfileSchema.static
export type UpdateRenterProfile = typeof updateRenterProfileSchema.static