import { PaginationQuerySchema } from "@core/schema";
import { UserRole, users } from "./users.schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-typebox";
import { t } from "elysia";

const _user = createSelectSchema(users);
const _createUser = createInsertSchema(users, {
  fullName: t.String({ minLength: 8, maxLength: 255 }),
  email: t.String({ format: "email" }),
  role: t.Enum(UserRole),
  password: t.String({ minLength: 8, maxLength: 255 }),
});
const _updateUser = createUpdateSchema(users, {
  email: t.String({ format: "email" }),
  role: t.Enum(UserRole),
});

export const userRoleSchema = t.Enum(UserRole);
export const userSchema = _user;
export const userResponseSchema = t.Omit(_user, ["password", "createdAt"]);
export const createUserSchema = t.Omit(_createUser, ["id", "createdAt"]);
export const updateUserSchema = t.Omit(t.Partial(_updateUser), [
  "id",
  "createdAt",
]);

export const userFiltersSchema = t.Object({
  q: t.Optional(t.String()),
  role: t.Optional(t.Enum(UserRole))
})

export const userQuerySchema = t.Composite([
  PaginationQuerySchema,
  userFiltersSchema
])

export type User = typeof userSchema.static;
export type UserResponse = typeof userResponseSchema.static;
export type CreateUser = typeof createUserSchema.static;
export type UpdateUser = Partial<typeof updateUserSchema.static>;
export type UserFilters = typeof userFiltersSchema.static
export type UserQuery = typeof userQuerySchema.static
