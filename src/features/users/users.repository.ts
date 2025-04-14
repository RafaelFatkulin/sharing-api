import { eq } from "drizzle-orm";
import { users } from "./users.schema";
import { CreateUser, UpdateUser, User } from "./users.types";
import { db } from "@core/db";

interface IUsersRepository
  extends BaseRepository<User, CreateUser, UpdateUser> {
  getByEmail: (email: string) => Promise<User | null>;
}

export class UsersRepository implements IUsersRepository {
  async getAll() {
    return db.query.users.findMany({
      orderBy(fields, operators) {
        return operators.desc(fields.createdAt);
      },
    });
  }

  async getById(id: number) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    return user ?? null;
  }

  async getByEmail(email: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    return user ?? null;
  }

  async create(data: CreateUser) {
    return db.transaction(async (tx) => {
      const [user] = await tx.insert(users).values(data).returning();

      return user ?? null;
    });
  }

  async update(id: number, data: UpdateUser) {
    return await db.transaction(async (tx) => {
      const [user] = await tx
        .update(users)
        .set(data)
        .where(eq(users.id, id))
        .returning();

      return user ?? null;
    });
  }

  async delete(id: number) {
    return await db.transaction(async (tx) => {
      const [user] = await tx.delete(users).where(eq(users.id, id)).returning();

      return user ?? null;
    });
  }
}
