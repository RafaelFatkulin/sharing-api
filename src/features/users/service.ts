import {db} from "../../core/db";
import {users} from "./schema";
import {eq} from "drizzle-orm";
import {CreateUser, UpdateUser} from "./types";
import {Elysia} from "elysia";

export class UsersService {
    async getAll() {
        return await db.select().from(users) || [];
    }
    async getById(id: number) {
        const user = db.query.users.findFirst({
            where: eq(users.id, id)
        })

        if (!user) {
            throw new Error('User not found')
        }

        return user
    }
    async create(data: CreateUser) {
        const hashedPassword = await Bun.password.hash(data.password, 'bcrypt')

        return db.transaction(async (tx) => {
            const [user] = await tx.insert(users)
                .values({
                    ...data,
                    password: hashedPassword,
                    createdAt: undefined
                })
                .returning()

            return user
        })
    }
    async update(id: number, data: UpdateUser) {
        const existingUser = await this.getById(id)

        if (!existingUser) {
            throw new Error(`User with id ${id} not found`)
        }

        return await db.transaction(async (tx) => {
            const [user] = await tx.update(users).set(data).returning()
            return user
        })
    }
}