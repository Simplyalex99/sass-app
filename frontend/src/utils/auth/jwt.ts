import jwt from 'jsonwebtoken'
import {
  REFRESH_TOKEN_EXPIRY_DATE_IN_SECONDS,
  ACCESS_TOKEN_EXPIRY_DATE_IN_SECONDS,
} from '@/constants/jwt'
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const refreshTokenErrorMessage =
  'JWT_REFRESH_TOKEN_SECRET environment variable not found.'
const accessTokenErrorMessage =
  'JWT_ACCESS_TOKEN_SECRET environment variable not found.'

type UserPayload = {
  userId: string
}
export class JWTUtil {
  private constructor() {
    if (this.constructor == JWTUtil) {
      throw new Error("Private classes can't be instantiated.")
    }
  }

  static createAccessToken(data: UserPayload) {
    if (!ACCESS_TOKEN_SECRET) {
      throw new Error(accessTokenErrorMessage)
    }
    const accessToken = jwt.sign(data, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY_DATE_IN_SECONDS,
    })
    return accessToken
  }
  static createRefreshToken(data: UserPayload) {
    if (!REFRESH_TOKEN_SECRET) {
      throw new Error(refreshTokenErrorMessage)
    }
    const refreshToken = jwt.sign(data, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY_DATE_IN_SECONDS,
    })
    return refreshToken
  }
  static verifyAccessToken(accessToken: string) {
    if (!ACCESS_TOKEN_SECRET) {
      throw new Error(accessTokenErrorMessage)
    }
    const result = jwt.verify(accessToken, ACCESS_TOKEN_SECRET)
    return result
  }

  static verifyRefreshToken(refreshToken: string) {
    if (!REFRESH_TOKEN_SECRET) {
      throw new Error(refreshTokenErrorMessage)
    }
    const result = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)
    return result
  }
  static decodeToken(token: string): UserPayload {
    const decodedPayload = jwt.decode(token) as UserPayload
    return decodedPayload
  }
}
