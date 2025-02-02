import { eq } from 'drizzle-orm'
import { db } from '../../../drizzle/database'
import { UserTable } from '../../../drizzle/schema'

export const userService = {
  getUserByEmail: async (email: string) => {
    const result = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email))
    return result
  },
  createUser: async (email: string): Promise<void> => {
    await db.insert(UserTable).values({ email })
  },
  deleteUserByEmail: async (email: string) => {
    const deletedUserID = await db
      .delete(UserTable)
      .where(eq(UserTable.email, email))
      .returning()
    return deletedUserID
  },
  addIsVerified: async (email: string) => {
    const now = new Date()
    const currentDate = new Date(now.getTime())
    await db
      .update(UserTable)
      .set({
        emailIsVerified: true,
        emailVerified: currentDate,
      })
      .where(eq(UserTable.email, email))
  },
}
