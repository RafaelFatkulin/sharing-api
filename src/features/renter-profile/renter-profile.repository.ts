import { db } from "@core/db";
import { CreateRenterProfile, RenterProfile, UpdateRenterProfile } from "./renter-profile.types";
import { eq } from "drizzle-orm";
import { renterProfiles } from "./renter-profile.schema";

interface IRenterProfileRepository extends BaseRepository<
    RenterProfile, 
    CreateRenterProfile, 
    UpdateRenterProfile
>{
    getUnique: (userId: number, name: string) => Promise<RenterProfile | null>
}

export class RenterProfileRepository implements IRenterProfileRepository {
    async getAll() {
        const renterProfiles = await db.query.renterProfiles.findMany({
            orderBy(fields, operators) {
                return operators.desc(fields.createdAt)
            }
        })

        return renterProfiles ?? []
    }

    async getById(id: string | number) {
        const renterProfile = await db.query.renterProfiles.findFirst({
            where: eq(renterProfiles.id, String(id))
        })

        return renterProfile ?? null
    }

    async getUnique(userId: number, name: string) {
        const renterProfile = await db.query.renterProfiles.findFirst({
            where(fields, operators) {
                return operators.and(operators.eq(fields.userId, userId), eq(fields.name, name))
            },
        })

        return renterProfile ?? null
    }

    async create(data: CreateRenterProfile) {
        return db.transaction(async (tx) => {
            const [renterProfile] = await tx.insert(renterProfiles).values(data).returning()

            return renterProfile || null
        })
    }

    async update(id: string | number, data: UpdateRenterProfile) {
        return await db.transaction(async (tx) => {
            const [renterProfile] = await tx
                .update(renterProfiles)
                .set(data)
                .where(eq(renterProfiles.id, String(id)))
                .returning()

            return renterProfile ?? null
        })
    }

    async delete(id: string | number) {
        return await db.transaction(async (tx) => {
            const [renterProfile] = await tx
                .delete(renterProfiles)
                .where(eq(renterProfiles.id, String(id)))
                .returning()

            return renterProfile ?? null
        })
    }
}