import type { User } from '@modules/users'
import type { AppRouteHandler } from 'types'
import type { Profile, Refresh, Signin, Signout, Signup, UpdateProfile } from './routes'
import { createUser, getUserByEmail } from '@modules/users'
import { createErrorResponse, createSuccessResponse } from '@utils/response'
import { HttpStatusCodes } from '@utils/status-codes'
import { createRefrehToken, getRefreshToken, revokeRefreshToken } from './services'
import { generateTokens } from './utils'

const signup: AppRouteHandler<Signup> = async (c) => {
  const data = c.req.valid('json')

  const existingUser = await getUserByEmail(data.email)

  if (existingUser) {
    return c.json(
      createErrorResponse({
        message: `Пользователь с почтой ${data.email} уже существует`,
      }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }

  const [user] = await createUser({
    ...data,
    role: 'superadmin' as User['role'],
  })

  if (!user) {
    return c.json(
      createErrorResponse({
        message: 'Произошла ошибка при регистрации',
      }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }

  const { at, rt, atExpiresAt, rtExpiresAt } = await generateTokens(
    user.id,
    user.role,
  )

  await createRefrehToken({
    token: rt,
    userId: user.id,
    expiresAt: rtExpiresAt,
  })

  return c.json(
    createSuccessResponse({
      message: 'Успешная регистрация',
      data: {
        accessToken: at,
        refreshToken: rt,
        accessExpiresAt: atExpiresAt,
        refreshExpiresAt: rtExpiresAt,
      },
    }),
    201,
  )
}

const signin: AppRouteHandler<Signin> = async (c) => {
  const { email, password } = c.req.valid('json')
  const incorrectMessage = 'Неверные данные, попробуйте еще раз'

  const user = await getUserByEmail(email)

  if (!user) {
    return c.json(
      createErrorResponse({ message: incorrectMessage }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }

  const isValidPassword = await Bun.password.verify(
    password,
    user.password,
    'bcrypt',
  )

  if (!isValidPassword) {
    return c.json(
      createErrorResponse({ message: incorrectMessage }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }

  const { at, rt, atExpiresAt, rtExpiresAt } = await generateTokens(
    user.id,
    user.role,
  )

  await createRefrehToken({
    token: rt,
    userId: user.id,
    expiresAt: rtExpiresAt,
  })

  return c.json(
    createSuccessResponse({
      message: 'Добро пожаловать',
      data: {
        accessToken: at,
        refreshToken: rt,
        accessExpiresAt: atExpiresAt,
        refreshExpiresAt: rtExpiresAt,
      },
    }),
    200,
  )
}

const signout: AppRouteHandler<Signout> = async (c) => {
  const { refreshToken } = c.req.valid('json')

  if (!refreshToken) {
    return c.json(
      createErrorResponse({ message: 'Отсутствует токен' }),
      HttpStatusCodes.UNAUTHORIZED,
    )
  }

  const existingToken = await getRefreshToken(refreshToken)

  if (!existingToken || existingToken.revoked) {
    return c.json(
      createErrorResponse({ message: 'Токена нет в базе' }),
      HttpStatusCodes.UNAUTHORIZED,
    )
  }

  await revokeRefreshToken(existingToken.id)

  return c.json(
    createSuccessResponse({
      message: 'Вы вышли из аккаунта',
      data: null,
    }),
    200,
  )
}

const refresh: AppRouteHandler<Refresh> = async (c) => { }

const profile: AppRouteHandler<Profile> = async (c) => { }

const updateProfile: AppRouteHandler<UpdateProfile> = async (c) => { }

export const handlers = {
  signup,
  signin,
  signout,
  refresh,
  profile,
  updateProfile,
}
