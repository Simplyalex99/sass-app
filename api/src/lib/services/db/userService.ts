import { eq } from 'drizzle-orm'
import { db } from '../../../drizzle/database'
import { UserTable, UserAccountTable } from '../../../drizzle/schema'
import { generateHashedPassword } from '#utils'
export const userService = {
  getUserByEmail: async (email: string) => {
    const result = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email))
    return result
  },
  createUser: async (
    email: string,
    plainTextPassword: string
  ): Promise<void> => {
    const { hashedPassword, salt } = generateHashedPassword(plainTextPassword)
    await db.insert(UserTable).values({ email })
    await db
      .insert(UserAccountTable)
      .values({ email, passwordHash: hashedPassword, passwordSalt: salt })
  },
  deleteUserByEmail: async (email: string) => {
    const deletedUserID = await db
      .delete(UserTable)
      .where(eq(UserTable.email, email))
      .returning()
    return deletedUserID
  },
}
