import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";

import * as users from "../features/users/users.schema";
import * as refreshTokens from "../features/auth/auth.schema";

const schema = {
  ...users,
  ...refreshTokens,
};
export const db = drizzle(process.env.DATABASE_URL!, {
  schema: schema,
});
