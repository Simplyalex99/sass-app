import { eq, sql } from 'drizzle-orm'
import { db } from '@/lib/drizzle/database'
import { UserAccountTable } from '@/lib/drizzle/schema'
import { generateHashedPassword } from '../../helpers/password'
export const userAccountService = {
  getUserByEmail: async (email: string) => {
    const result = await db
      .select()
      .from(UserAccountTable)
      .where(eq(UserAccountTable.email, email))
    return result
  },
  createUser: async (
    userId: string,
    email: string,
    plainTextPassword: string
  ): Promise<void> => {
    const { hashedPassword, salt } = generateHashedPassword(plainTextPassword)
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
}
