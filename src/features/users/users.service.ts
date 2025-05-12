import {
  CreateUser,
  UpdateUser,
  UserFilters,
  UserQuery,
  UserResponse,
} from "./users.types";
import Elysia, { InternalServerError, NotFoundError } from "elysia";
import { UsersRepository } from "./users.repository";
import { usersToResponse, userToResponse } from "./users.helpers";
import { trans } from "@core/locales";

export class UsersService {
  constructor(private repository: UsersRepository) { }

  async getAll(filter: UserQuery) {
    const {users, total} = await this.repository.getAll(filter)
    
    return {
      users: usersToResponse(users),
      meta: {
        total,
        page: filter.page ?? 1,
        perPage: filter.perPage ?? 10,
        totalPages: Math.ceil(total / (filter.perPage ?? 1))
      }
    } 
  }

  async getById(id: number) {  
    const user = await this.repository.getById(id);

    if (!user) {
      throw new NotFoundError(trans('users.errors.not-found', { id }));
    }

    return userToResponse(user);
  }

  async getByEmail(email: string) {
    return await this.repository.getByEmail(email);
  }

  async create(data: CreateUser): Promise<UserResponse> {
    const existingUser = await this.getByEmail(data.email);

    if (existingUser) {
      throw new NotFoundError(trans('users.errors.email-in-use', { email: data.email }));
    }

    const user = await this.repository.create({
      ...data,
      password: await Bun.password.hash(data.password, "bcrypt"),
    });

    if (!user) {
      throw new InternalServerError(trans('users.errors.create'));
    }

    return userToResponse(user);
  }

  async update(id: number, data: UpdateUser) {
    await this.getById(id);

    const user = await this.repository.update(id, {
      ...data,
      password: data.password
        ? await Bun.password.hash(data.password, "bcrypt")
        : undefined,
    });

    if (!user) {
      throw new InternalServerError(trans('users.errors.update'));
    }

    return userToResponse(user);
  }

  async delete(id: number) {
    await this.getById(id);

    const user = await this.repository.delete(id);

    return userToResponse(user);
  }
}
export const usersServicePlugin = new Elysia({ name: 'users.service' })
  .decorate(
    'usersService',
    new UsersService(
      new UsersRepository()
    )
  )
  .as('scoped')