import { eq, sql } from 'drizzle-orm'
import { db } from '@/lib/drizzle/database'
import { UserAccountTable } from '@/lib/drizzle/schema'
import { generateHashedPassword } from '@/helpers/password'
export const userAccountService = {
  getUserByEmail: async (email: string) => {
    const result = await db
      .select()
      .from(UserAccountTable)
      .where(eq(UserAccountTable.email, email))
    return result
  },
  getUserById: async (userId: string) => {
    const result = await db
      .select()
      .from(UserAccountTable)
      .where(eq(UserAccountTable.userId, userId))
    return result
  },
  createUser: async (
    userId: string,
    email: string,
    plainTextPassword: string
  ): Promise<void> => {
    const { salt, hashedPassword } =
      await generateHashedPassword(plainTextPassword)
    await db.insert(UserAccountTable).values({
      userId,
      email,
      passwordHash: hashedPassword,
      passwordSalt: salt,
    })
  },

  addFailedAttempt: async (email: string, lastAttemptAt: Date) => {
    await db
      .update(UserAccountTable)
      .set({
        failedAttempts: sql`${UserAccountTable.failedAttempts} + 1`,
        lastAttemptAt,
      })
      .where(eq(UserAccountTable.email, email))
  },
  updatePassword: async (email: string, plainTextPassword: string) => {
    const { salt, hashedPassword } =
      await generateHashedPassword(plainTextPassword)
    await db
      .update(UserAccountTable)
      .set({
        passwordHash: hashedPassword,
        passwordSalt: salt,
      })
      .where(eq(UserAccountTable.email, email))
  },
}
