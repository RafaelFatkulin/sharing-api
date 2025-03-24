import type { OpenAPIHono, z } from '@hono/zod-openapi'
import type { User } from '@modules/users/types'
import type { PinoLogger } from 'hono-pino'

export interface AppBindings {
  Variables: {
    logger: PinoLogger,
    user: User
  }
}

export type AppOpenAPI = OpenAPIHono<AppBindings>
