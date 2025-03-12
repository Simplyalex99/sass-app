import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { INTERNAL_SERVER_ERROR } from '@/constants/errorStatusCodeMessages'
import { JWTCookieUtil } from '@/utils/auth/cookie'
import { createHashedToken } from '@/utils/tokens/token'
import { InvalidateJwtUtil } from '@/utils/auth/invalidateJwt'
import log from '@/utils/others/log'

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
    const hashedAccessToken = await createHashedToken(accessToken)
    const hashedRefreshToken = await createHashedToken(refreshToken)

    await Promise.all([
      InvalidateJwtUtil.blacklistRefreshToken(hashedRefreshToken.token),
      InvalidateJwtUtil.blacklistAccessToken(hashedAccessToken.token),
    ])
  } catch (err) {
    log.error(err)
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 })
  }
  return NextResponse.json({}, { status: 200 })
}
