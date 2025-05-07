import Elysia from "elysia";
import { errorPlugin, responsePlugin } from "./plugins";

export const core = new Elysia({ name: 'core' })
    .use(errorPlugin)
    .use(responsePlugin)
    .as('scoped')