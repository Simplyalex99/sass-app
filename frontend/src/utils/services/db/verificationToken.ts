import { eq, sql } from 'drizzle-orm'
import { db } from '@/lib/drizzle/database'
import { VerificationTokenTable } from '@/lib/drizzle/schema'

export const verificationTokenService = {
  getUserByEmail: async (email: string) => {
    const result = await db
      .select()
      .from(VerificationTokenTable)
      .where(eq(VerificationTokenTable.email, email))
    return result
  },

  createOneTimePasscode: async (
    email: string,
    otp: string,
    otpExpiresAt: Date
  ) => {
    await db.insert(VerificationTokenTable).values({
      email,
      otp,
      otpExpiresAt,
    })
  },
  penalizeFailedAttempt: async (email: string) => {
    await db
      .update(VerificationTokenTable)
      .set({
        failedAttempts: sql`${VerificationTokenTable.failedAttempts} + 1`,
      })
      .where(eq(VerificationTokenTable.email, email))
  },
  lockAndPenalizeFailedAttempSession: async (
    email: string,
    lockUntil: Date
  ) => {
    await db
      .update(VerificationTokenTable)
      .set({
        lockUntil,
        failedAttempts: 0,
        failedAttemptSessions: sql`${VerificationTokenTable.failedAttemptSessions} + 1`,
      })
      .where(eq(VerificationTokenTable.email, email))
  },

  deleteOneTimePasscode: async (email: string) => {
    await db
      .delete(VerificationTokenTable)
      .where(eq(VerificationTokenTable.email, email))
  },
}
