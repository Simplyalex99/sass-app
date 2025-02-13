import { eq, sql } from 'drizzle-orm'
import { db } from '../../../drizzle/database'
import { UserAccountTable } from '../../../drizzle/schema'
import { generateHashedPassword } from '#utils'
export const userAccountService = {
  getUserByEmail: async (email: string) => {
    const result = await db
      .select()
      .from(UserAccountTable)
      .where(eq(UserAccountTable.email, email))
    return result
  },
  createUser: async (
    email: string,
    plainTextPassword: string
  ): Promise<void> => {
    const { hashedPassword, salt } = generateHashedPassword(plainTextPassword)
    await db
      .insert(UserAccountTable)
      .values({ email, passwordHash: hashedPassword, passwordSalt: salt })
  },

  setIsLocked: async (email: string, isLocked: boolean) => {
    await db
      .update(UserAccountTable)
      .set({ isLocked })
      .where(eq(UserAccountTable.email, email))
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
