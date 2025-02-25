import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  JWTCookieUtil,
  createHashedToken,
  InvalidateJwtUtil,
  log,
} from '@/utils'
import { INTERNAL_SERVER_ERROR } from '@/constants/errorStatusCodeMessages'
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET
if (!accessTokenSecret) {
  throw new Error('Access token secret not defined')
}
export const POST = async () => {
  try {
    const cookieStore = await cookies()

    const jwtCookieUtil = new JWTCookieUtil()
    const tokens = jwtCookieUtil.readCookie(cookieStore)

    if (tokens === undefined) {
      return NextResponse.json({}, { status: 401 })
    }
    const [accessToken, refreshToken] = tokens
    if (!accessToken || !refreshToken) {
      return NextResponse.json({}, { status: 401 })
    }
    jwtCookieUtil.clearCookie(cookieStore)

    const hashedAccessToken = createHashedToken(accessToken)
    const hashedRefreshToken = createHashedToken(refreshToken)

    Promise.all([
      InvalidateJwtUtil.blacklistRefreshToken(hashedRefreshToken),
      InvalidateJwtUtil.blacklistAccessToken(hashedAccessToken),
    ])
  } catch (err) {
    log.error(err)
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 })
  }
  return NextResponse.json({}, { status: 200 })
}
