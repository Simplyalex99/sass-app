import { JWTCookieUtil } from './cookie'
import { InvalidateJwtUtil } from './invalidateJwt'
import { JWTUtil } from './jwt'
import { cookies } from 'next/headers'
import { fetchHashToken } from '@/utils/api/api'
type validateTokensType = {
  isAuthenticated: boolean
  newTokens: null | { accessToken: string; refreshToken: string }
}
export const validateTokens = async (): Promise<validateTokensType> => {
  const cookieUtil = new JWTCookieUtil()
  const cookieStore = await cookies()

  const tokens = cookieUtil.readCookie(cookieStore)

  if (!tokens) return { isAuthenticated: false, newTokens: null }

  const [accessToken, refreshToken] = tokens

  const { isValidToken, isExpired } = await validateAccessToken(accessToken)

  if (!isValidToken) {
    return { isAuthenticated: false, newTokens: null }
  }
  if (isValidToken && isExpired === false) {
    return { isAuthenticated: true, newTokens: null }
  }

  const result = await renewTokens(refreshToken)

  return result
}

const validateAccessToken = async (accessToken?: string) => {
  try {
    if (accessToken == undefined) {
      return { isValidToken: true, isExpired: true }
    }
    const payload = (await JWTUtil.verifyAccessToken(accessToken)).payload

    const response = await fetchHashToken(accessToken)

    const { body } = response
    const hashedAccessToken = body.token

    const invalidAccessToken =
      await InvalidateJwtUtil.getInvalidToken(hashedAccessToken)

    if (invalidAccessToken) {
      return { isValidToken: false, isExpired: false }
    }

    const isExpired = payload.exp !== undefined && payload.exp < Date.now()
    return { isExpired, isValidToken: true }
  } catch {
    return { isValidToken: false, isExpired: false }
  }
}

const renewTokens = async (refreshToken?: string) => {
  try {
    if (refreshToken === undefined) {
      return { isAuthenticated: false, newTokens: null }
    }
    await JWTUtil.verifyRefreshToken(refreshToken)
    const response = await fetchHashToken(refreshToken)
    const { body } = response
    const hashedRefreshToken = body.token
    const invalidRefreshToken =
      await InvalidateJwtUtil.getInvalidToken(hashedRefreshToken)
    if (invalidRefreshToken) {
      return { isAuthenticated: false, newTokens: null }
    }

    const { userId } = await JWTUtil.decodeRefreshToken(refreshToken)

    const newAccessToken = await JWTUtil.createAccessToken({ userId })

    const newRefreshToken = await JWTUtil.createRefreshToken({ userId })

    const cookieUtil = new JWTCookieUtil()
    const cookieStore = await cookies()

    cookieUtil.clearCookie(cookieStore)
    cookieUtil.saveCookie([newAccessToken, newRefreshToken], cookieStore)

    return {
      isAuthenticated: true,
      newTokens: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    }
  } catch {
    return { isAuthenticated: false, newTokens: null }
  }
}
