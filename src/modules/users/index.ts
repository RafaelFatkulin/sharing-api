import { createRouter } from '@lib/create-app'
import { handlers } from './handlers'
import { routes } from './routes'

export * from './schemas'
export * from './services'
export * from './types'

export const users = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.get, handlers.get)
  .openapi(routes.create, handlers.create)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove)
