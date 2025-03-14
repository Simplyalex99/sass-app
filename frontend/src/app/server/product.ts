'use server'

import { getUser } from '@/utils/auth/getUser'
import { productService } from '@/utils/services/db/products'
export const deleteProductAction = async (productId: string) => {
  const user = await getUser()
  if (!user) {
    return { error: 'There was an error creating your product' }
  }

  if (!productId || !user) {
    return { error: 'Bad request' }
  }
  try {
    const rowCount = await productService.deleteProduct({
      productId,
      userId: user.userId,
    })
    if (!rowCount) {
      return { message: 'Error deleting product' }
    }
    return { message: 'Product deleted' }
  } catch (err) {
    console.log(err)
    return { error: 'There was an error deleting your product' }
  }
}
