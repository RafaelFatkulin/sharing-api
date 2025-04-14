import {
  CreateUser,
  createUserSchema,
  UpdateUser,
  UserResponse,
} from "./users.types";
import { InternalServerError, NotFoundError } from "elysia";
import { UsersRepository } from "./users.repository";
import { UnauthorizedError } from "@core/core.errors";
import { password } from "bun";
import { usersToResponse, userToResponse } from "./users.helpers";

export class UsersService {
  constructor(private repository: UsersRepository) {}

  async getAll() {
    return usersToResponse(await this.repository.getAll());
  }

  async getById(id: number) {
    const user = await this.repository.getById(id);

    if (!user) {
      throw new NotFoundError(`User with id=#${id} not found`);
    }

    return userToResponse(user);
  }

  async getByEmail(email: string) {
    return await this.repository.getByEmail(email);
  }

  async create(data: CreateUser): Promise<UserResponse> {
    const existingUser = await this.getByEmail(data.email);

    if (existingUser) {
      throw new NotFoundError(`Email ${data.email} already in use`);
    }

    const user = await this.repository.create({
      ...data,
      password: await Bun.password.hash(data.password, "bcrypt"),
    });

    if (!user) {
      throw new InternalServerError("Error while creating user");
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
      throw new InternalServerError("Error while updating user");
    }

    return userToResponse(user);
  }

  async delete(id: number) {
    await this.getById(id);

    const user = await this.repository.delete(id);

    return userToResponse(user);
  }
}
