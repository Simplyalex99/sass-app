/* eslint-disable @typescript-eslint/no-unused-vars */
import { createCookieExpiryDateInMilliseconds } from './createCookieExpiryDateInMilliseconds'
import {
  REFRESH_TOKEN_KEY,
  REFRESH_TOKEN_EXPIRY_DATE_IN_SECONDS,
  ACCESS_TOKEN_EXPIRY_DATE_IN_SECONDS,
  ACCESS_TOKEN_KEY,
} from '@/constants'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
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
    // @typescript-eslint/no-unused-vars
    _data: Array<T> | string[],
    _cookieStore: ReadonlyRequestCookies
  ) {
    throw new Error("Method 'saveCookie()' must be implemented.")
  }
  // @typescript-eslint/no-unused-vars
  clearCookie(_cookieStore: ReadonlyRequestCookies) {
    throw new Error("Method 'clearCookie()' must be implemented.")
  }
  // @typescript-eslint/no-unused-vars
  readCookie(
    _cookieStore: ReadonlyRequestCookies
  ): Array<string | undefined> | undefined {
    throw new Error("Method 'readCookie()' must be implemented.")
  }
}

export class JWTCookieUtil extends CookieUtil {
  saveCookie(data: string[], cookieStore: ReadonlyRequestCookies) {
    const secureCookieOptions = {
      secure: true,
      sameSite: 'strict' as const,
    }
    if (data.length < 2) {
      return
    }
    const accessToken = data[0]
    const refreshToken = data[1]
    const isHttpOnly = process.env.NODE_ENV === 'development' ? false : true
    cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, {
      expires: createCookieExpiryDateInMilliseconds(
        REFRESH_TOKEN_EXPIRY_DATE_IN_SECONDS
      ),
      httpOnly: isHttpOnly,
      ...secureCookieOptions,
    })
    cookieStore.set(ACCESS_TOKEN_KEY, accessToken, {
      expires: createCookieExpiryDateInMilliseconds(
        ACCESS_TOKEN_EXPIRY_DATE_IN_SECONDS
      ),
      httpOnly: isHttpOnly,
      ...secureCookieOptions,
    })
  }

  clearCookie(cookieStore: ReadonlyRequestCookies) {
    cookieStore.delete(REFRESH_TOKEN_KEY)
    cookieStore.delete(ACCESS_TOKEN_KEY)
  }
  readCookie(cookieStore: ReadonlyRequestCookies) {
    if (!cookieStore) {
      return undefined
    }

    const refreshStore = cookieStore.get(REFRESH_TOKEN_KEY)
    const accessStore = cookieStore.get(ACCESS_TOKEN_KEY)
    const tokens: Array<undefined | string> = [undefined, undefined]

    if (accessStore !== undefined) {
      const accessToken = accessStore.value
      tokens[0] = accessToken
    }
    if (refreshStore !== undefined) {
      const refreshToken = refreshStore.value
      tokens[1] = refreshToken
    }
    return tokens
  }
}
