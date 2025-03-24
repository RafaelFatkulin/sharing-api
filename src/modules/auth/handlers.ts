import type { User } from '@modules/users'
import type { AppRouteHandler } from 'types'
import type { Profile, Refresh, Signin, Signout, Signup, UpdateProfile } from './routes'
import { createUser, getUser, getUserByEmail, updateUser } from '@modules/users'
import { createErrorResponse, createSuccessResponse } from '@utils/response'
import { HttpStatusCodes } from '@utils/status-codes'
import { createRefrehToken, getRefreshToken, revokeRefreshToken } from './services'
import { generateTokens } from './utils'
import type { Context } from 'hono'

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

  const [user] = await createUser(data)

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

const refresh: AppRouteHandler<Refresh> = async (c) => {
  const { refreshToken } = c.req.valid('json')

  if (!refreshToken) {
    return c.json(
      createErrorResponse({
        message: 'Недействительный токен'
      }),
      HttpStatusCodes.UNAUTHORIZED
    )
  }

  const exisitingRefreshToken = await getRefreshToken(refreshToken, false)

  if (!exisitingRefreshToken) {
    return c.json(
      createErrorResponse({ message: 'Недействительный токен' }),
      HttpStatusCodes.UNAUTHORIZED
    )
  }

  const user = await getUser(exisitingRefreshToken.userId!)

  if (!user) {
    return c.json(
      createErrorResponse({ message: 'Недействительный токен' }),
      HttpStatusCodes.UNAUTHORIZED
    )
  }

  const {
    at,
    rt: newRefreshToken,
    rtExpiresAt,
    atExpiresAt
  } = await generateTokens(user.id, user.role)

  await revokeRefreshToken(exisitingRefreshToken.id)

  await createRefrehToken({
    token: newRefreshToken,
    userId: user.id,
    expiresAt: rtExpiresAt
  })

  return c.json(
    createSuccessResponse({
      data: {
        accessToken: at,
        refreshToken: newRefreshToken,
        accessExpiresAt: atExpiresAt,
        refreshExpiresAt: rtExpiresAt,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone ? user.phone : undefined,
          role: user.role,
        },
      },
    }),
    200,
  )
}

const profile: AppRouteHandler<Profile> = async (c) => {
  const user = c.get('user')

  if (!user) {
    return c.json(
      createErrorResponse({ message: 'Пользователь не найден' }),
      HttpStatusCodes.UNAUTHORIZED
    )
  }

  return c.json(createSuccessResponse({ data: user }), HttpStatusCodes.OK)
}

const updateProfile: AppRouteHandler<UpdateProfile> = async (c) => {
  const data = c.req.valid('json')
  const user = c.get('user')

  if (!user) {
    return c.json(
      createErrorResponse({ message: 'Пользователь не найден' }),
      HttpStatusCodes.UNAUTHORIZED
    )
  }

  try {
    const [updatedUser] = await updateUser(user.id, data)

    return c.json(
      createSuccessResponse({
        message: `Информация аккаунта обновлена`,
        data: updatedUser,
      }),
      HttpStatusCodes.OK,
    )
  }
  catch {
    return c.json(
      createErrorResponse({
        message: 'Ошибка при редактировании аккаунта',
      }),
      HttpStatusCodes.BAD_REQUEST,
    )
  }
}

export const handlers = {
  signup,
  signin,
  signout,
  refresh,
  profile,
  updateProfile,
}
