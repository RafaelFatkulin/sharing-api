import {Elysia} from "elysia";
import {serverConfig} from "./core/config";
import swagger from "@elysiajs/swagger";
import {usersRoute} from "./features/users/route";

const plugin = new Elysia({name: 'plugin'})
    .macro({
        hi(word: string) {
            return {
                beforeHandle() {
                    console.log(word);
                }
            }
        }
    })

const app = new Elysia()
    .use(swagger())
    .use(usersRoute)
    .listen(serverConfig.port);
