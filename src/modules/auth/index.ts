import { createRouter } from '@lib/create-app.ts'
import { handlers } from '@modules/auth/handlers.ts'
import { routes } from '@modules/auth/routes.ts'

export * from './schemas'
export * from './services'
export * from './types'

export const auth = createRouter()
  .openapi(routes.signup, handlers.signup)
  .openapi(routes.signin, handlers.signin)
  .openapi(routes.signout, handlers.signout)
  .openapi(routes.refresh, handlers.refresh)
  .openapi(routes.profile, handlers.profile)
  .openapi(routes.updateProfile, handlers.updateProfile)
