import { configureOpenAPI } from '@lib/configure-open-api'
import { createApp } from '@lib/create-app'
import { auth } from '@modules/auth'
import { users } from '@modules/users'
import { env } from 'hono/adapter'
import { serveStatic } from 'hono/bun'

export const app = createApp()

const routes = [
  users,
  auth,
]

configureOpenAPI(app)

routes.forEach((route) => {
  app.route('/', route)
})

app.get('/env', (c) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)
  return c.text(DATABASE_URL)
})

app.use('/uploads/*', serveStatic({ root: './' }))

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
})
