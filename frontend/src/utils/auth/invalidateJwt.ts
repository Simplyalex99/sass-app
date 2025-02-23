import { redis } from '@/lib/upstash/redis'
import {
  REFRESH_TOKEN_EXPIRY_DATE_IN_SECONDS,
  ACCESS_TOKEN_EXPIRY_DATE_IN_SECONDS,
} from '@/constants/jwt'
export class InvalidateJwtUtil {
  private constructor() {
    if (this.constructor == InvalidateJwtUtil) {
      throw new Error("Private classes can't be instantiated.")
    }
  }
  static blacklistRefreshToken(hashedRefreshToken: string) {
    return redis.set(hashedRefreshToken, 'blacklist', {
      ex: REFRESH_TOKEN_EXPIRY_DATE_IN_SECONDS,
    })
  }
  static blacklistAccessToken(hashedAccessToken: string) {
    return redis.set(hashedAccessToken, 'whitelist', {
      ex: ACCESS_TOKEN_EXPIRY_DATE_IN_SECONDS,
    })
  }
  static getInvalidToken(hashedToken: string) {
    return redis.get(hashedToken)
  }
}
