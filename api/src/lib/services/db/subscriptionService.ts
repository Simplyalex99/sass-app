import { db } from '../../../drizzle/database'
import { UserSubscriptionTable } from '../../../drizzle/schema'

export const subscriptionService = {
  createSubscription: async (
    data: typeof UserSubscriptionTable.$inferInsert
  ) => {
    const result = await db.insert(UserSubscriptionTable).values(data)
    return result
  },
}
