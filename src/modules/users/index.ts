import { createRouter } from "@lib/create-app";
import { routes } from "./routes";
import { handlers } from "./handlers";

export * from './schemas'
export * from './types'
export * from './services'

export const users = createRouter()
    .openapi(routes.list, handlers.list)
    .openapi(routes.get, handlers.get)
    .openapi(routes.create, handlers.create)
    .openapi(routes.update, handlers.update)
    .openapi(routes.remove, handlers.remove)