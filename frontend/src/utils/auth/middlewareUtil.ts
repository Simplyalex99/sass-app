import { JWTCookieUtil } from './cookie'
import { JWTUtil } from './jwt'
import { JwtPayload } from 'jsonwebtoken'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { InvalidateJwtUtil } from '@/utils/auth/invalidateJwt'
export const validateAccessToken = async (
  cookieStore: ReadonlyRequestCookies
): Promise<{
  isExpired: boolean
  isValidAccessToken: boolean
  accessToken?: string
}> => {
  try {
    const cookieUtil = new JWTCookieUtil()
    const tokens = cookieUtil.readCookie(cookieStore)
    if (!tokens) {
      return { isExpired: true, isValidAccessToken: false }
    }

    const accessToken = tokens[0] ? tokens[0] : ''
    const payload = JWTUtil.verifyAccessToken(accessToken, {
      complete: true,
      ignoreExpiration: true,
    }) as JwtPayload
    const cachedAccessToken = InvalidateJwtUtil.getInvalidToken(accessToken)
    const expiresAt = payload.exp
    const now = Date.now()
    if (!expiresAt || cachedAccessToken !== null) {
      return { isExpired: true, isValidAccessToken: false }
    }
    if (expiresAt < now) {
      return { isExpired: true, isValidAccessToken: true, accessToken }
    }
    return { isExpired: false, isValidAccessToken: true, accessToken }
  } catch {
    return { isExpired: true, isValidAccessToken: false }
  }
}
export const validateRefreshToken = async (
  cookieStore: ReadonlyRequestCookies
): Promise<{ isValidRefreshToken: boolean }> => {
  try {
    const cookieUtil = new JWTCookieUtil()
    const tokens = cookieUtil.readCookie(cookieStore)
    if (!tokens) {
      return { isValidRefreshToken: false }
    }
    const refreshToken = tokens[1] ? tokens[1] : ''
    JWTUtil.verifyRefreshToken(refreshToken)
    const cachedRefreshToken =
      await InvalidateJwtUtil.getInvalidToken(refreshToken)
    if (cachedRefreshToken !== null) {
      return { isValidRefreshToken: false }
    }
    return { isValidRefreshToken: true }
  } catch {
    return { isValidRefreshToken: false }
  }
}
export const renewTokens = (
  cookieStore: ReadonlyRequestCookies,
  accessToken: string
) => {
  const payload = JWTUtil.decodeToken(accessToken)
  const userId = payload.userId
  const newAccessToken = JWTUtil.createAccessToken({ userId })
  const newRefreshToken = JWTUtil.createRefreshToken({ userId })
  const jwtCookie = new JWTCookieUtil()
  jwtCookie.clearCookie(cookieStore)
  jwtCookie.saveCookie([newAccessToken, newRefreshToken], cookieStore)
}
