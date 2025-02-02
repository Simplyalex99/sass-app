import { Request, Response } from 'express'
import { createCookieExpiryDateInMilliseconds } from './createCookieExpiryDateInMilliseconds'
import { REFRESH_TOKEN_KEY, REFRESH_TOKEN_EXPIRY_DATE_IN_SECONDS } from '#enums'
/**
 * Abstract Class CookieUtil
 *
 * @abstract CookieUtil
 */
export class CookieUtil {
  constructor() {
    if (this.constructor == CookieUtil) {
      throw new Error("Abstract classes can't be instantiated.")
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  saveCookie(_res: Response, _key: string) {
    throw new Error("Method 'saveCookie()' must be implemented.")
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clearCookie(res: Response) {
    throw new Error("Method 'clearCookie()' must be implemented.")
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  readCookie(req: Request): string | undefined {
    throw new Error("Method 'readCookie()' must be implemented.")
  }
}

export class JWTCookieUtil extends CookieUtil {
  saveCookie(res: Response, refreshToken: string): void {
    const secureCookieOptions = {
      secure: true,
      sameSite: 'strict' as const,
    }

    res.cookie(REFRESH_TOKEN_KEY, refreshToken, {
      expires: createCookieExpiryDateInMilliseconds(
        REFRESH_TOKEN_EXPIRY_DATE_IN_SECONDS
      ),
      httpOnly: true,
      ...secureCookieOptions,
    })
  }

  clearCookie(res: Response) {
    res.clearCookie(REFRESH_TOKEN_KEY, {
      maxAge: 0,
    })
  }
  readCookie(req: Request) {
    return req?.cookies?.[REFRESH_TOKEN_KEY] ?? undefined
  }
}
