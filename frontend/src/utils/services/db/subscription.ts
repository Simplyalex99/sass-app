import { db } from '@/lib/drizzle/database'
import { UserSubscriptionTable } from '@/lib/drizzle/schema'
import { CACHE_TAGS, revalidateDbCache } from '@/utils/auth/cache'

export const subscriptionService = {
  createSubscription: async (
    data: typeof UserSubscriptionTable.$inferInsert
  ) => {
    const result = await db
      .insert(UserSubscriptionTable)
      .values(data)
      .onConflictDoNothing({ target: UserSubscriptionTable.userId })
      .returning({
        id: UserSubscriptionTable.id,
        userId: UserSubscriptionTable.userId,
      })
    if (result.length !== 0) {
      revalidateDbCache({
        tag: CACHE_TAGS.subscription,
        userId: result[0].userId,
        id: result[0].id,
      })
    }
    return result
  },
}
