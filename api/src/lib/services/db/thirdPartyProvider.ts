import { eq } from 'drizzle-orm'
import { db } from '../../../drizzle/database'
import { ThirdPartyAccountTable } from '../../../drizzle/schema'

export const providerService = {
  getUserByEmail: async (email: string) => {
    const result = await db
      .select()
      .from(ThirdPartyAccountTable)
      .where(eq(ThirdPartyAccountTable.email, email))
    return result
  },
  createUser: async (
    data: typeof ThirdPartyAccountTable.$inferInsert
  ): Promise<void> => {
    await db.insert(ThirdPartyAccountTable).values(data)
  },
  deleteUserByEmail: async (email: string) => {
    const deletedUserID = await db
      .delete(ThirdPartyAccountTable)
      .where(eq(ThirdPartyAccountTable.email, email))
      .returning()
    return deletedUserID
  },
}
