import { NotFoundError } from 'elysia';
import { UsersRepository } from './users.repository';
import { UnauthorizedError } from '@core/core.errors';

export class UsersService {
    constructor(private usersRepo: UsersRepository) {
    }

    async getAll() {
        return await this.usersRepo.getAll()
    }

    async getById(id: number) {
        const user = await this.usersRepo.getById(id)

        if (!user) {
            throw new UnauthorizedError(`User with id=#${id} not found`)
        }

        return user
    }

    async getByEmail(email: string) {
        const user = this.usersRepo.getByEmail(email)

        if (!user) {
            throw new NotFoundError(`User with email=#${email} not found`)
        }

        return user
    }
}