import { refreshTokens } from './refresh-tokens'
import { rentalPointContacts } from './rental-point-contacts'
import { rentalPoints } from './rental-points'
import { userRole, users } from './users'

export {
  refreshTokens,
  rentalPointContacts,
  rentalPoints,
  userRole,
  users,
}

export const table = {
  users,
  userRole,
  refreshTokens,
  rentalPoints,
  rentalPointContacts,
} as const

export type Table = typeof table
