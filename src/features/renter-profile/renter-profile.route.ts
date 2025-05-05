import Elysia from "elysia";
import { RenterProfilesModel } from "./renter-profile.model";
import { renterProfilesServicePlugin } from "./renter-profile.service";
import { CoreModel } from "@core/model";
import { trans } from "@core/locales";

export const renterProfilesRoute = new Elysia({ prefix: '/renter-profiles', tags: ['Renter Profiles'] })
    .use(CoreModel)
    .use(RenterProfilesModel)
    .use(renterProfilesServicePlugin)
    .get('/', async ({ renterProfilesService, set }) => {
        set.status = 200
        const renterProfiles = await renterProfilesService.getAll()

        return {
            renterProfiles
        }
    }, {
        response: {
            200: "renter-profile.array-response"
        }
    })
    .get(
        "/:id",
        async ({ params, renterProfilesService, set }) => {
            const renterProfile = await renterProfilesService.getById(params.id)

            set.status = 200

            return { renterProfile }
        },
        {
            params: 'param.string-id',
            response: {
                200: 'renter-profile.response',
                404: 'error'
            }
        }
    )
    .post(
        '/',
        async ({ set, body, renterProfilesService }) => {
            const renterProfile = await renterProfilesService.create(body)
            set.status = 201

            return {
                renterProfile
            }
        }, 
        {
            body: 'renter-profile.create',
            response: {
                201: 'renter-profile.response'
            }
        }
    )
    .patch(
        '/:id',
        async ({ set, params, body, renterProfilesService }) => {
            const renterProfile = await renterProfilesService.update(params.id, body)
            set.status = 200

            return {
                renterProfile,
                message: trans('renter-profiles.messages.updated')
            }
        },
        {
            params: 'param.string-id',
            body: 'renter-profile.update'
        }
    )
    .delete(
        '/:id',
        async ({ set, params, renterProfilesService }) => {
            const renterProfile = await renterProfilesService.delete(params.id)
            set.status = 200

            return {
                renterProfile,
                message: trans('renter-profiles.messages.deleted')
            }
        },
        {
            params: 'param.string-id'
        }
    )