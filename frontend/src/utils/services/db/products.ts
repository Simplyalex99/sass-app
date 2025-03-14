import { db } from '@/lib/drizzle/database'
import { ProductCustomizationTable, ProductTable } from '@/lib/drizzle/schema'
import { CACHE_TAGS, revalidateDbCache } from '@/utils/auth/cache'
import { and, eq } from 'drizzle-orm'

export const productService = {
  getProducts: async (id: string, { limit }: { limit?: number }) => {
    const result = await db.query.ProductTable.findMany({
      where: ({ userId }, { eq }) => eq(userId, id),
      orderBy: ({ createdAt }, { desc }) => desc(createdAt),
      limit,
    })

    return result
  },
  createProduct: async (data: typeof ProductTable.$inferInsert) => {
    const [newProduct] = await db
      .insert(ProductTable)
      .values(data)
      .returning({ id: ProductTable.id, userId: ProductTable.userId })
    try {
      await db
        .insert(ProductCustomizationTable)
        .values({ productId: newProduct.id })
        .onConflictDoNothing({ target: ProductCustomizationTable.productId })

      revalidateDbCache({
        tag: CACHE_TAGS.products,
        userId: data.userId,
        id: newProduct.id,
      })
      return { productId: newProduct.id, userId: newProduct.userId }
    } catch {
      await db.delete(ProductTable).where(eq(ProductTable.id, newProduct.id))
    }
  },
  updateProduct: async (data: typeof ProductTable.$inferInsert) => {
    if (!data.id) {
      return
    }
    await db
      .update(ProductTable)
      .set({ ...data })
      .where(
        and(eq(ProductTable.userId, data.userId), eq(ProductTable.id, data.id))
      )

    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId: data.userId,
      id: data.id,
    })
  },
  deleteProduct: async (data: { userId: string; productId: string }) => {
    if (!data.productId) {
      return
    }
    const { rowCount } = await db
      .delete(ProductTable)
      .where(
        and(
          eq(ProductTable.id, data.productId),
          eq(ProductTable.userId, data.userId)
        )
      )
    if (rowCount > 0) {
      revalidateDbCache({
        tag: CACHE_TAGS.products,
        userId: data.userId,
        id: data.productId,
      })
    }
    return rowCount > 0
  },
}
