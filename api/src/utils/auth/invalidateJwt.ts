import { redisClient } from '../../config/redis'
import {
  REFRESH_TOKEN_EXPIRY_DATE_IN_SECONDS,
  ACCESS_TOKEN_EXPIRY_DATE_IN_SECONDS,
} from '#enums'
export class InvalidateJwtUtil {
  private constructor() {
    if (this.constructor == InvalidateJwtUtil) {
      throw new Error("Private classes can't be instantiated.")
    }
  }
  static blacklistRefreshToken(hashedRefreshToken: string) {
    return redisClient.set(hashedRefreshToken, 'blacklist', {
      EX: REFRESH_TOKEN_EXPIRY_DATE_IN_SECONDS,
    })
  }
  static whitelistAccessToken(hashedAccessToken: string) {
    return redisClient.set(hashedAccessToken, 'whitelist', {
      EX: ACCESS_TOKEN_EXPIRY_DATE_IN_SECONDS,
    })
  }
}
