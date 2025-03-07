import type { SuccessResponse } from '@utils/response'
import type { SQL } from 'drizzle-orm'
import type { User, UserCreate, UserFilter, UserUpdate } from './types'
import { db } from '@database'
import { table } from '@database/schemas'
import { eq } from 'drizzle-orm'

export function generatePassword(length: number = 12) {
  const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  const allChars = upperCaseChars + lowerCaseChars + numbers + specialChars
  const password = [
    upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)],
    lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    specialChars[Math.floor(Math.random() * specialChars.length)],
  ]

  for (let i = password.length; i < length; i++) {
    password.push(allChars[Math.floor(Math.random() * allChars.length)])
  }

  return password.sort(() => Math.random() - 0.5).join('')
}

export async function getUsers(filter: UserFilter) {
  const {
    q,
    page,
    per_page = 10,
    sort_by = 'id',
    sort_order = 'desc',
    role,
  } = filter

  const totalUsers = await db.$count(table.users)
  const totalPages = Math.ceil(totalUsers / Number(per_page))

  const users = await db.query.users.findMany({
    columns: {
      password: false,
    },
    where(fields, { or, ilike, eq }) {
      const conditions: SQL[] = []

      if (q) {
        const searchQuery = `%${q.toLowerCase()}%`
        conditions.push(
          or(
            ilike(fields.email, searchQuery),
            ilike(fields.fullName, searchQuery),
          ) as SQL,
        )
      }

      if (role) {
        conditions.push(eq(fields.role, role))
      }

      return conditions.length ? or(...conditions) : undefined
    },
    orderBy(fields, operators) {
      return sort_order === 'asc'
        ? operators.asc(fields[sort_by])
        : operators.desc(fields[sort_by])
    },
    limit: per_page,
    offset: page && per_page ? (page - 1) * per_page : undefined,
  })

  return {
    data: users,
    meta: page
      ? {
        total: totalUsers,
        totalPages,
        limit: per_page,
        page,
      }
      : undefined,
  } as SuccessResponse
}

export async function getUser(userId: number) {
  return await db.query.users.findFirst({
    where({ id }, { eq }) {
      return eq(id, userId)
    },
  })
}

export async function getUserByEmail(userEmail: string) {
  return await db.query.users.findFirst({
    where({ email }, { eq }) {
      return eq(email, userEmail)
    },
  })
}

export async function createUser(data: UserCreate) {
  return db
    .insert(table.users)
    .values({
      ...data,
      role: data.role as User['role'],
      password: await Bun.password.hash(data.password ? data.password : 'password', 'bcrypt'),
    })
    .returning({
      id: table.users.id,
      fullName: table.users.fullName,
      email: table.users.email,
      phone: table.users.phone,
      role: table.users.role,
    })
}

export async function updateUser(userId: number, userData: UserUpdate) {
  return db
    .update(table.users)
    .set({
      ...userData,
      role: userData.role ? userData.role as User['role'] : undefined,
    })
    .where(eq(table.users.id, userId))
    .returning({
      id: table.users.id,
      fullName: table.users.fullName,
      email: table.users.email,
      phone: table.users.phone,
      role: table.users.role,
    })
}

export async function deleteUser(userId: number) {
  return db.delete(table.users).where(eq(table.users.id, userId)).returning({
    id: table.users.id,
    fullName: table.users.fullName,
    email: table.users.email,
    phone: table.users.phone,
    role: table.users.role,
  })
}
