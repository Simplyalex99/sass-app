import { db } from '@/lib/drizzle/database'
import { ProductCustomizationTable, ProductTable } from '@/lib/drizzle/schema'
import { and, eq } from 'drizzle-orm'

export const productService = {
  getProducts: async (id: string, limit?: number) => {
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
      .returning({ id: ProductTable.id })
    try {
      await db
        .insert(ProductCustomizationTable)
        .values({ productId: newProduct.id })
        .onConflictDoNothing({ target: ProductCustomizationTable.productId })
      return newProduct.id
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
    return rowCount > 0
  },
}
