import { jsonContent } from '@helpers/json-content'
import { jsonContentRequired } from '@helpers/json-content-required'
import { createRoute } from '@hono/zod-openapi'
import { userSchema, userUpdateSchema } from '@modules/users'
import { errorResponseSchema, getSuccessResponseSchema } from '@utils/response'
import { HttpStatusCodes } from '@utils/status-codes'
import { PATHS, TAGS } from './constants'
import { authMiddleware } from './middleware'
import { authResponseSchema, refreshSchema, signinSchema, signoutSchema, signupSchema } from './schemas'

const signup = createRoute({
  tags: TAGS,
  path: PATHS.signup,
  method: 'post',
  summary: 'User Sign up',
  description: 'Creates a new user account with provided credentials',
  request: {
    body: jsonContentRequired(signupSchema, 'Signup data'),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      getSuccessResponseSchema(authResponseSchema),
      'Signup successfull',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      'Signup error',
    ),
  },
})

const signin = createRoute({
  tags: TAGS,
  path: PATHS.signin,
  method: 'post',
  summary: 'User Sign in',
  description: 'Authenticates a user and returns access tokens',
  request: {
    body: jsonContentRequired(signinSchema, 'Signin data'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(authResponseSchema),
      'Signin successfull',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      'Signin error',
    ),
  },
})

const signout = createRoute({
  tags: TAGS,
  path: PATHS.signout,
  method: 'post',
  summary: 'User Sign out',
  description: 'Terminates user session and invalidates tokens',
  request: {
    body: jsonContentRequired(signoutSchema, 'Signout data'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(authResponseSchema),
      'Signout successfull',
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorResponseSchema,
      'Signout error',
    ),
  },
})

const refresh = createRoute({
  tags: TAGS,
  path: PATHS.refresh,
  method: 'post',
  summary: 'Refresh Access Token',
  description: 'Generates new access token using refresh token',
  request: {
    body: jsonContentRequired(refreshSchema, 'Refresh token data'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(),
      'Refreshing token successful',
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorResponseSchema,
      'Refresh token error',
    ),
  },
})

const profile = createRoute({
  tags: TAGS,
  path: PATHS.profile,
  method: 'get',
  summary: 'Get User Profile',
  description: 'Retrieves authenticated user profile information',
  middleware: [authMiddleware] as const,
  security: [{
    Bearer: [],
  }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(userSchema),
      'Profile info',
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorResponseSchema,
      'User not found',
    ),
  },
})

const updateProfile = createRoute({
  tags: TAGS,
  path: PATHS.updateProfile,
  method: 'post',
  summary: 'Update User Profile',
  description: 'Modifies authenticated user profile information',
  middleware: [authMiddleware] as const,
  security: [{
    Bearer: [],
  }],
  request: {
    body: jsonContentRequired(userUpdateSchema, 'Update profile data'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getSuccessResponseSchema(),
      'Profile updated',
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorResponseSchema,
      'User not found',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      'Profile update error',
    ),
  },
})

export const routes = {
  signup,
  signin,
  signout,
  refresh,
  profile,
  updateProfile,
}

export type Signup = typeof signup
export type Signin = typeof signin
export type Signout = typeof signout
export type Refresh = typeof refresh
export type Profile = typeof profile
export type UpdateProfile = typeof updateProfile
