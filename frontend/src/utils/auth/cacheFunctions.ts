import { productService } from '../services/db/products'
import { CACHE_TAGS, dbCache, getUserTag } from './cache'

export const getCachedProducts = (
  userId: string,
  { limit }: { limit?: number }
) => {
  const cacheFn = dbCache(productService.getProducts, {
    tags: [getUserTag(userId, CACHE_TAGS.products)],
  })

  return cacheFn(userId, { limit })
}
export const testGetProductCache = (
  userId: string,
  { limit }: { limit?: number }
) => {
  const cacheFn = dbCache(productService.getProducts, {
    tags: [getUserTag(userId, CACHE_TAGS.products)],
  })

  return cacheFn(userId, { limit })
}
