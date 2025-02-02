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
  createOneTimePasscode: async (email: string, oneTimePasscode: number) => {
    const now = new Date()
    const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000)
    await db
      .update(UserAccountTable)
      .set({
        oneTimePasscode,
        oneTimePasscodeExpiresAt: tenMinutesLater,
      })
      .where(eq(UserAccountTable.email, email))
  },
  addFailedAttempts: async (email: string) => {
    await db
      .update(UserAccountTable)
      .set({ failedAttempts: sql`${UserAccountTable.failedAttempts} + 1` })
      .where(eq(UserAccountTable.email, email))
  },
  setIsLocked: async (email: string) => {
    const now = new Date()
    const fifteenMinutesLater = new Date(now.getTime() + 15 * 60 * 1000)
    await db
      .update(UserAccountTable)
      .set({ lockUntil: fifteenMinutesLater, isLocked: true })
      .where(eq(UserAccountTable.email, email))
  },
  deleteOneTimePasscode: async (email: string) => {
    await db
      .update(UserAccountTable)
      .set({
        lockUntil: null,
        isLocked: false,
        oneTimePasscode: null,
        oneTimePasscodeExpiresAt: null,
      })
      .where(eq(UserAccountTable.email, email))
  },
}
