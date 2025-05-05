import Elysia, { InternalServerError, NotFoundError } from "elysia";
import { RenterProfileRepository } from "./renter-profile.repository";
import { trans } from "@core/locales";
import { CreateRenterProfile, RenterProfile, UpdateRenterProfile } from "./renter-profile.types";

export class RenterProfilesService {
    constructor(private repository: RenterProfileRepository) { }

    async getAll() {
        return await this.repository.getAll()
    }

    async getById(id: string) {
        const renterProfile = await this.repository.getById(id)

        if(!renterProfile) {
            throw new NotFoundError(trans('renter-profiles.errors.not-found', { id }))
        }

        return renterProfile
    }

    async getUnique(userId: number, name: string) {
        const renterProfile = await this.repository.getUnique(userId, name)

        if(!renterProfile) {
            throw new NotFoundError(trans('renter-profiles.errors.not-found-unique', {userId, name}))
        }

        return renterProfile
    }

    async create(data: CreateRenterProfile): Promise<RenterProfile> {
        const existingRenterProfile = await this.getUnique(data.userId, data.name)

        if(existingRenterProfile) {
            throw new InternalServerError(trans('renter-profiles.errors.already-exists', {
                userId: data.userId, 
                name: data.name
            }))
        }

        const renterProfile = await this.repository.create(data)
    
        if(!renterProfile) {
            throw new InternalServerError(trans('renter-profiles.errors.create'))
        }

        return renterProfile
    }

    async update(id: string, data: UpdateRenterProfile) {
        await this.getById(id)

        const renterProfile = await this.repository.update(id, data)

        if(!renterProfile) {
            throw new InternalServerError(trans('renter-profiles.errors.update'));
        }

        return renterProfile
    }

    async delete(id: string) {
        await this.getById(id)

        const renterProfile = await this.repository.delete(id)

        return renterProfile
    }
}

export const renterProfilesServicePlugin = new Elysia({ name: 'renter-profiles.service' })
    .decorate(
        'renterProfilesService',
        new RenterProfilesService(
            new RenterProfileRepository()
        )
    )
    .as('scoped')