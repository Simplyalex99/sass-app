import 'dotenv/config'
import jwt from 'jsonwebtoken'
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET
const SECONDS_IN_A_MINUTE = 60
const EXPIRY_DATE_IN_MINUTES = 15
const ACCESS_TOKEN_EXPIRY_DATE_IN_SECONDS =
  SECONDS_IN_A_MINUTE * EXPIRY_DATE_IN_MINUTES // 900 seconds
const REFRESH_TOKEN_EXPIRY_DATE_IN_DAYS = `30d`

export class JWTUtil {
  private constructor() {
    if (this.constructor == JWTUtil) {
      throw new Error("Private classes can't be instantiated.")
    }
  }

  static createAccessToken(data: string | Buffer | object) {
    if (!JWT_ACCESS_TOKEN_SECRET) {
      throw new Error('JWT_ACCESS_TOKEN_SECRET environment variable not found.')
    }
    const accessToken = jwt.sign(data, JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY_DATE_IN_SECONDS,
    })
    return accessToken
  }
  static createRefreshToken(data: string | Buffer | object) {
    if (!JWT_REFRESH_TOKEN_SECRET) {
      throw new Error(
        'JWT_REFRESH_TOKEN_SECRET environment variable not found.'
      )
    }
    const refreshToken = jwt.sign(data, JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY_DATE_IN_DAYS,
    })
    return refreshToken
  }
}
