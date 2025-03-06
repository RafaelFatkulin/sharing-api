import { users, userRole } from './users'
import { refreshTokens } from './refresh-tokens'
import { rentalPoints } from './rental-points'
import { rentalPointContacts } from './rental-point-contacts'

export {
    users,
    userRole,
    refreshTokens,
    rentalPoints,
    rentalPointContacts
}

export const table = {
    users,
    userRole,
    refreshTokens,
    rentalPoints,
    rentalPointContacts
} as const

export type Table = typeof table