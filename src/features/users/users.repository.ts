import { and, eq, ilike, or, SQL } from "drizzle-orm";
import { users } from "./users.schema";
import { CreateUser, UpdateUser, User, UserQuery } from "./users.types";
import { db } from "@core/db";


export class UsersRepository {
  async getAll(filter: UserQuery) {
    const { page = 1, perPage = 10, q, role } = filter;
    const offset = (page - 1) * perPage;
    
    const whereConditions: SQL[] = [];
  
    if (q) {
      const searchCondition = or(
        ilike(users.fullName, `%${q.toLowerCase()}%`),
        ilike(users.email, `%${q.toLowerCase()}%`)
      ) as SQL<unknown>;
      whereConditions.push(searchCondition);
    }

    if (role) {
      whereConditions.push(eq(users.role, role));
    }
  
    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined
  
    const usersList = await db.query.users.findMany({
      where: whereClause,
      orderBy(fields, operators) {
        return operators.desc(fields.createdAt);
      },
      limit: perPage,
      offset,
    });
  
    const total = await db.$count(users, whereClause);
  
    return {
      users: usersList,
      total,
    };
  }

  async getById(id: number | string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, Number(id)),
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

  async update(id: number | string, data: UpdateUser) {
    return await db.transaction(async (tx) => {
      const [user] = await tx
        .update(users)
        .set(data)
        .where(eq(users.id, Number(id)))
        .returning();

      return user ?? null;
    });
  }

  async delete(id: number | string) {
    return await db.transaction(async (tx) => {
      const [user] = await tx.delete(users).where(eq(users.id, Number(id))).returning();

      return user ?? null;
    });
  }
}
