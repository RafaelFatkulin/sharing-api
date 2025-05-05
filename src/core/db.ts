import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";

import * as users from "../features/users/users.schema";
import * as refreshTokens from "../features/auth/auth.schema";
import * as renterProfiles from "@features/renter-profile/renter-profile.schema";

const schema = {
  ...users,
  ...refreshTokens,
  ...renterProfiles,
};
export const db = drizzle(process.env.DATABASE_URL!, {
  schema: schema,
});
