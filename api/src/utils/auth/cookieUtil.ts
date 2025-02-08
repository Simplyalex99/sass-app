/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express'
import { createCookieExpiryDateInMilliseconds } from './createCookieExpiryDateInMilliseconds'
import {
  REFRESH_TOKEN_KEY,
  REFRESH_TOKEN_EXPIRY_DATE_IN_SECONDS,
  ACCESS_TOKEN_EXPIRY_DATE_IN_SECONDS,
  ACCESS_TOKEN_KEY,
} from '#enums'
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
  saveCookie<T extends string | number>(
    _res: Response,
    // @typescript-eslint/no-unused-vars
    _data: Array<T> | string[]
  ) {
    throw new Error("Method 'saveCookie()' must be implemented.")
  }
  // @typescript-eslint/no-unused-vars
  clearCookie(res: Response) {
    throw new Error("Method 'clearCookie()' must be implemented.")
  }
  // @typescript-eslint/no-unused-vars
  readCookie(req: Request): string[] | undefined {
    throw new Error("Method 'readCookie()' must be implemented.")
  }
}

export class JWTCookieUtil extends CookieUtil {
  saveCookie(res: Response, data: string[]): void {
    const secureCookieOptions = {
      secure: true,
      sameSite: 'strict' as const,
    }
    if (data.length < 2) {
      return
    }
    const accessToken = data[0]
    const refreshToken = data[1]

    res.cookie(REFRESH_TOKEN_KEY, refreshToken, {
      expires: createCookieExpiryDateInMilliseconds(
        REFRESH_TOKEN_EXPIRY_DATE_IN_SECONDS
      ),
      httpOnly: true,
      ...secureCookieOptions,
    })
    res.cookie(ACCESS_TOKEN_KEY, accessToken, {
      expires: createCookieExpiryDateInMilliseconds(
        ACCESS_TOKEN_EXPIRY_DATE_IN_SECONDS
      ),
      httpOnly: true,
      ...secureCookieOptions,
    })
  }

  clearCookie(res: Response) {
    res.clearCookie(REFRESH_TOKEN_KEY, {
      maxAge: 0,
    })
    res.clearCookie(ACCESS_TOKEN_KEY, {
      maxAge: 0,
    })
  }
  readCookie(req: Request) {
    const cookies = req?.cookies

    if (!cookies) {
      return undefined
    }
    const refreshToken = cookies[REFRESH_TOKEN_KEY]
    const accessToken = cookies[ACCESS_TOKEN_KEY]
    return [accessToken, refreshToken]
  }
}
