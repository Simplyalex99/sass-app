import { NextFunction, Request, Response } from 'express'
import { AuthSchema, AuthSchemaType } from '#lib'
import {
  formatSchemaErrorMessages,
  JWTCookieUtil,
  createHashedToken,
  InvalidateJwtUtil,
  CsrfUtil,
} from '#utils'

export const logoutController = async (
  req: Request<object, object, AuthSchemaType>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = AuthSchema.safeParse(req.body)
    if (!result.success) {
      const invalidFieldsMessage = formatSchemaErrorMessages(
        result.error.issues
      )
      return res.status(400).json({ error: invalidFieldsMessage })
    }
    const { email, csrf } = result.data
    const hashedCsrf = createHashedToken(csrf)
    const isTokenValid = await CsrfUtil.isTokenValid(email, hashedCsrf)
    if (!isTokenValid) {
      return res.status(401).send()
    }
    const jwtCookieUtil = new JWTCookieUtil()
    const tokens = jwtCookieUtil.readCookie(req)

    if (tokens === undefined) {
      return res.status(401).send()
    }
    const [accessToken, refreshToken] = tokens
    if (accessToken === null || refreshToken === null) {
      return res.status(401).send()
    }
    jwtCookieUtil.clearCookie(res)

    const hashedAccessToken = createHashedToken(accessToken)
    const hashedRefreshToken = createHashedToken(refreshToken)

    InvalidateJwtUtil.blacklistRefreshToken(hashedRefreshToken)
    InvalidateJwtUtil.blacklistAccessToken(hashedAccessToken)
    return res.status(200).send()
  } catch (err) {
    next(err)
  }
}
