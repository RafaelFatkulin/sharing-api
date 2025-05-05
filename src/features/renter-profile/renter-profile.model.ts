import Elysia, { t } from "elysia";
import { createRenterProfileSchema, renterProfileSchema, updateRenterProfileSchema } from "./renter-profile.types";

export const RenterProfilesModel = new Elysia().model({
    renterProfile: renterProfileSchema,
    "renter-profile.response": t.Object({
        renterProfile: renterProfileSchema,
      }),
    "renter-profile.array-response": t.Object({renterProfiles: t.Array(renterProfileSchema)}),
    "renter-profile.create": createRenterProfileSchema,
    "renter-profile.update": updateRenterProfileSchema,
}).as('scoped')