import * as jwt from 'jose'
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
if (!ACCESS_TOKEN_SECRET) {
  throw new Error(accessTokenErrorMessage)
}
if (!REFRESH_TOKEN_SECRET) {
  throw new Error(refreshTokenErrorMessage)
}
const jwtAccessKey = jwt.base64url.decode(ACCESS_TOKEN_SECRET)
const jwtRefreshKey = jwt.base64url.decode(REFRESH_TOKEN_SECRET)
export class JWTUtil {
  private constructor() {
    if (this.constructor == JWTUtil) {
      throw new Error("Private classes can't be instantiated.")
    }
  }

  static async createAccessToken(data: UserPayload) {
    const accessToken = await new jwt.SignJWT(data)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${ACCESS_TOKEN_EXPIRY_DATE_IN_SECONDS}s`)
      .sign(jwtAccessKey)
    return accessToken
  }
  static async createRefreshToken(data: UserPayload) {
    const refreshToken = await new jwt.SignJWT(data)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${REFRESH_TOKEN_EXPIRY_DATE_IN_SECONDS}s`)
      .sign(jwtRefreshKey)
    return refreshToken
  }
  static async verifyAccessToken(
    accessToken: string,
    opts: { algorithms?: string[]; currentDate?: Date } = {
      algorithms: ['HS256'],
      currentDate: new Date(0),
    }
  ) {
    const result = await jwt.jwtVerify(accessToken, jwtAccessKey, {
      ...opts,
    })

    return result
  }

  static async verifyRefreshToken(
    refreshToken: string,
    opts: { algorithms?: string[]; currentDate?: Date } = {
      algorithms: ['HS256'],
      currentDate: new Date(0),
    }
  ) {
    const result = await jwt.jwtVerify(refreshToken, jwtRefreshKey, {
      ...opts,
    })
    return result
  }
  static async decodeAccessToken(token: string): Promise<UserPayload> {
    const decodedPayload = await JWTUtil.verifyAccessToken(token)
    return decodedPayload.payload as UserPayload
  }
  static async decodeRefreshToken(token: string): Promise<UserPayload> {
    const decodedPayload = await JWTUtil.verifyRefreshToken(token, {
      currentDate: new Date(),
    })
    return decodedPayload.payload as UserPayload
  }
}
