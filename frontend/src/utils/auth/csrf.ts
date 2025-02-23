import { redis } from '@/lib/upstash/redis'
import { CRSF_TOKEN_EXPIRY_DATE_IN_SECONDS } from '@/constants/jwt'
export class CsrfUtil {
  private constructor() {
    if (this.constructor == CsrfUtil) {
      throw new Error("Private classes can't be instantiated.")
    }
  }
  static storeToken(email: string, hashedCsrfToken: string) {
    return redis.set(email, hashedCsrfToken, {
      ex: CRSF_TOKEN_EXPIRY_DATE_IN_SECONDS,
    })
  }
  static getToken(email: string) {
    return redis.get(email)
  }
  static async isTokenValid(email: string, plainTextHashedToken: string) {
    const hashedCsrfToken = await CsrfUtil.getToken(email)
    if (hashedCsrfToken === null) {
      return false
    }
    return plainTextHashedToken === hashedCsrfToken
  }
}
