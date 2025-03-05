import { JWTUtil } from './jwt'
import { cookies } from 'next/headers'
import { JWTCookieUtil } from './cookie'
export const getUser = async () => {
  const cookieStore = await cookies()
  const jwtCookie = new JWTCookieUtil()
  const tokens = jwtCookie.readCookie(cookieStore)
  if (!tokens || !tokens[0] || !tokens[1]) {
    return undefined
  }
  const accessToken = tokens[0]
  const payload = JWTUtil.decodeToken(accessToken)
  return payload
}
