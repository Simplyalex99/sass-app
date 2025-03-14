import { eq } from 'drizzle-orm'
import { db } from '@/lib/drizzle/database'
import {
  ProductTable,
  ThirdPartyAccountTable,
  UserAccountTable,
  UserSubscriptionTable,
  UserTable,
} from '@/lib/drizzle/schema'
import { CACHE_TAGS, revalidateDbCache } from '@/utils/auth/cache'

export const userService = {
  getUserByEmail: async (email: string) => {
    const result = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email))
    return result
  },
  createUser: async (
    email: string
  ): Promise<(typeof UserTable.$inferSelect)[]> => {
    const result = await db.insert(UserTable).values({ email }).returning()
    return result
  },
  deleteUserById: async (userId: string) => {
    const [userSubscriptions, products, providers, accounts, profile] =
      await db.batch([
        db
          .delete(UserSubscriptionTable)
          .where(eq(UserSubscriptionTable.userId, userId))
          .returning({ id: UserSubscriptionTable.id }),
        db
          .delete(ProductTable)
          .where(eq(ProductTable.userId, userId))
          .returning({ id: ProductTable.id }),
        db
          .delete(ThirdPartyAccountTable)
          .where(eq(ThirdPartyAccountTable.userId, userId))
          .returning({ id: ThirdPartyAccountTable.id }),
        db
          .delete(UserAccountTable)
          .where(eq(UserAccountTable.userId, userId))
          .returning({ id: UserAccountTable.id }),
        db.delete(UserTable).where(eq(UserTable.id, userId)).returning(),
      ])

    userSubscriptions.forEach((sub) => {
      revalidateDbCache({
        tag: CACHE_TAGS.subscription,
        id: sub.id,
        userId,
      })
    })

    products.forEach((prod) => {
      revalidateDbCache({
        tag: CACHE_TAGS.products,
        id: prod.id,
        userId,
      })
    })

    return { userSubscriptions, products, providers, accounts, profile }
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
  setIsLocked: async (email: string, isLocked: boolean) => {
    await db
      .update(UserTable)
      .set({ isLocked })
      .where(eq(UserTable.email, email))
  },
}
