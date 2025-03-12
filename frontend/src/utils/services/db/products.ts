import { db } from '@/lib/drizzle/database'

export const productService = {
  getProducts: async (id: string, limit?: number) => {
    const result = await db.query.ProductTable.findMany({
      where: ({ userId }, { eq }) => eq(userId, id),
      orderBy: ({ createdAt }, { desc }) => desc(createdAt),
      limit,
    })

    return result
  },
}
