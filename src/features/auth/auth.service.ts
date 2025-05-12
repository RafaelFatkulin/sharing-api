import { UsersRepository } from "@features/users/users.repository";
import { AuthRepository } from "./auth.repository";
import { trans } from "@core/locales";
import { BadRequestError } from "@core/core.errors";
import { JWT, SignIn, SignUp } from "./auth.types";
import Elysia, { InternalServerError } from "elysia";
import { userToResponse } from "@features/users/users.helpers";
import { UserRole } from "@features/users/users.schema";

export class AuthService {
    constructor(
        private repository: AuthRepository,
        private usersRepository: UsersRepository,
    ) { }

    async getUserById(id: number) {
        const user = await this.usersRepository.getById(id);

        if (!user) {
            throw new BadRequestError(trans("auth.errors.incorrect"));
        }

        return user;
    }

    async getUserByEmail(email: string) {
        const user = await this.usersRepository.getByEmail(email);

        if (!user) {
            throw new BadRequestError(trans("auth.errors.incorrect"));
        }

        return user;
    }

    async checkEmailNotBusy(email: string) {
        const user = await this.usersRepository.getByEmail(email);

        if (user) {
            throw new BadRequestError(trans("users.errors.email-in-use", { email }));
        }
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
        await this.repository.deleteAllRefreshTokens(userId);

        const refreshToken = await this.repository.createRefreshToken(
            userId,
            token
        );

        if (!refreshToken) {
            throw new BadRequestError(trans("auth.errors.token-error"));
        }

        return;
    }

    async generateTokens(
        { id, email }: { id: number, email: string },
        jwt: JWT,
        refreshJwt: JWT
    ) {
        const accessJWTToken = await jwt.sign({
            id,
            email,
        });

        const refreshJWTToken = await refreshJwt.sign({
            id,
            email,
        });

        return {
            accessJWTToken,
            refreshJWTToken
        }
    }

    async getRefreshToken(token: string) {
        const refreshToken = await this.repository.getRefreshToken(token)

        if (!refreshToken) {
            throw new BadRequestError(trans("auth.errors.token-error"));
        }

        return refreshToken
    }

    async signin(
        { email, password }: SignIn,
        jwt: JWT,
        refreshJwt: JWT,
    ) {
        const user = await this.getUserByEmail(email);
        await this.comparePasswords(password, user.password);

        const {
            accessJWTToken,
            refreshJWTToken
        } = await this.generateTokens(
            { id: user.id, email: user.email },
            jwt,
            refreshJwt
        )

        await this.createRefreshToken(user.id, refreshJWTToken);

        return {
            user: userToResponse(user),
            accessToken: accessJWTToken,
            refreshToken: refreshJWTToken,
        };
    }

    async signup(data: SignUp) {
        await this.checkEmailNotBusy(data.email)

        const user = await this.usersRepository.create({
            ...data,
            role: data.role ? data.role : UserRole.USER,
            password: await Bun.password.hash(data.password, "bcrypt")
        })

        if (!user) {
            throw new InternalServerError(trans('auth.errors.register'));
        }

        return userToResponse(user)
    }

    async refresh(token: string, jwt: JWT, refreshJwt: JWT) {
        const refreshToken = await this.getRefreshToken(token)
        const user = await this.getUserById(refreshToken.userId)

        const {
            accessJWTToken,
            refreshJWTToken
        } = await this.generateTokens(
            { id: user.id, email: user.email },
            jwt,
            refreshJwt
        )

        await this.createRefreshToken(user.id, refreshJWTToken);

        return {
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
