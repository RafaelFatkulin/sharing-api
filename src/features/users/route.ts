import {Elysia, t} from "elysia";
import {IdParamSchema} from "../../core/schema";
import {UsersService} from "./service";

export const usersRoute = new Elysia({prefix: '/users'})
    .decorate('usersRepo', new UsersService())
    .get('/', async ({usersRepo, set}) => {
        try {
            const users = await usersRepo.getAll()

            set.status = 200

            return {
                users
            }
        } catch (error) {
            set.status = 500
            return {
                error
            }
        }
    })
    .get('/:id', async ({params, usersRepo, set, error}) => {
            const user = await usersRepo.getById(Number(params.id))

            if(!user) {
                return error('Bad Request', {
                    error: `User with id ${params.id} not found`
                })
            }

            set.status = 200

            return {
                user
            }
    })