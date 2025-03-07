import type { z } from 'zod'
import type { userCreateSchema, userSchema, usersFilterSchema, userUpdateSchema } from './schemas'

export type User = z.output<typeof userSchema>
export type UserCreate = z.output<typeof userCreateSchema>
export type UserUpdate = z.output<typeof userUpdateSchema>
export type UserFilter = z.output<typeof usersFilterSchema>
