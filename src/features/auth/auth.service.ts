import { UsersRepository } from "@features/users/users.repository";
import { AuthRepository } from "./auth.repository";
import { trans } from "@core/locales";
import { BadRequestError } from "@core/core.errors";
import { JWT } from "./auth.types";
import { getExpTimestamp } from "./auth.utils";
import { jwtConfig } from "@core/config";
import Elysia from "elysia";
import { userToResponse } from "@features/users/users.helpers";

export class AuthService {
  constructor(
    private repository: AuthRepository,
    private usersRepository: UsersRepository
  ) {}

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.getByEmail(email);

    if (!user) {
      throw new BadRequestError(trans("auth.errors.incorrect"));
    }

    return user;
  }

  async comparePasswords(comparable: string, original: string) {
    const isPasswordsMatch = await Bun.password.verify(
      comparable,
      original,
      "bcrypt"
    );

    if (!isPasswordsMatch) {
      throw new BadRequestError(trans("auth.errors.incorrect"));
    }

    return;
  }

  async createRefreshToken(userId: number, token: string) {
    console.log({ token });
    await this.repository.deleteRefreshToken(token);

    const refreshToken = await this.repository.createRefreshToken(
      userId,
      token
    );

    if (!refreshToken) {
      throw new BadRequestError(trans("auth.errors.token-error"));
    }

    return;
  }

  async signin(
    { email, password }: { email: string; password: string },
    jwt: JWT,
    refreshJwt: JWT
  ) {
    const user = await this.getUserByEmail(email);
    await this.comparePasswords(password, user.password);

    const accessJWTToken = await jwt.sign({
      sub: String(user.id),
      exp: getExpTimestamp(jwtConfig.accessExpiresIn),
    });

    const refreshJWTToken = await refreshJwt.sign({
      sub: String(user.id),
      exp: getExpTimestamp(jwtConfig.refreshExpiresIn),
    });

    console.log(
      getExpTimestamp(jwtConfig.accessExpiresIn),
      getExpTimestamp(jwtConfig.refreshExpiresIn)
    );

    await this.createRefreshToken(user.id, refreshJWTToken);

    return {
      user: userToResponse(user),
      accessToken: accessJWTToken,
      refreshToken: refreshJWTToken,
    };
  }
}

export const authServicePlugin = new Elysia({ name: "auth.service" })
  .decorate(
    "authService",
    new AuthService(new AuthRepository(), new UsersRepository())
  )
  .as("scoped");
