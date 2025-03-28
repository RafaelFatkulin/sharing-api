import { table, userRole } from '@database/schemas'
import { z } from '@hono/zod-openapi'
import { emailField, enumField, phoneField, stringField } from '@utils/zod'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

export const userSchema = createSelectSchema(table.users).omit({
  createdAt: true,
  updatedAt: true,
  password: true,
}).openapi('User schema')

export const userCreateSchema = createInsertSchema(table.users, {
  fullName: stringField(6, 128).openapi({ example: 'Иванов Иван Иванович' }),
  email: emailField().openapi({ example: 'ivanov_i@vk.com' }),
  password: stringField(8, 64).optional().openapi({ example: 'password' }),
  role: enumField(userRole.enumValues).openapi({ examples: userRole.enumValues }),
}).omit({
  createdAt: true,
  updatedAt: true,
}).openapi('User create schema')

export const userUpdateSchema = createUpdateSchema(table.users, {
  fullName: stringField(4, 128).optional().openapi({ example: 'Иванов Иван Иванович' }),
  email: emailField().optional().openapi({ example: 'ivanov_i@vk.com' }),
  password: stringField(8, 64).optional().openapi({ example: 'password' }),
  phone: phoneField().optional().openapi({ example: '88005553535' }),
  role: enumField(userRole.enumValues).optional(),
}).omit({
  createdAt: true,
  updatedAt: true,
}).openapi('User Update Schema')

export const usersFilterSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1).optional().openapi({ description: 'Page number' }),
  per_page: z.coerce.number().int().min(1).max(100).default(10).optional().openapi({ description: 'Items per page' }),
  role: z.enum(userRole.enumValues).optional(),
  sort_by: userSchema.keyof().optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
})
