import { JWTUtil } from '@/utils/auth/jwt'
import { cookies } from 'next/headers'
import { JWTCookieUtil } from '@/utils/auth/cookie'
import { NextResponse } from 'next/server'
export const POST = async () => {
  const cookieStore = await cookies()
  const jwtCookie = new JWTCookieUtil()
  const tokens = jwtCookie.readCookie(cookieStore)
  if (!tokens || !tokens[0] || !tokens[1]) {
    return NextResponse.json({ user: undefined }, { status: 200 })
  }
  const accessToken = tokens[0]
  const payload = await JWTUtil.decodeAccessToken(accessToken)
  return NextResponse.json({ user: payload }, { status: 200 })
}
