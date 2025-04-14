import { CreateUser, createUserSchema, UserResponse } from "./types";
import { InternalServerError, NotFoundError } from "elysia";
import { UsersRepository } from "./users.repository";
import { UnauthorizedError } from "@core/core.errors";

export class UsersService {
  constructor(private repository: UsersRepository) {}

  async getAll() {
    return await this.repository.getAll();
  }

  async getById(id: number) {
    const user = await this.repository.getById(id);

    if (!user) {
      throw new NotFoundError(`User with id=#${id} not found`);
    }

    return user;
  }

  async getByEmail(email: string) {
    const user = this.repository.getByEmail(email);

    if (!user) {
      throw new NotFoundError(`User with email=#${email} not found`);
    }

    return user;
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

    const { password, createdAt, ...userResponse } = user;
    return userResponse as UserResponse;
  }
}
