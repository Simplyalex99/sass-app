import { NextFunction, Request, Response } from 'express'
import { EmailSchema, EmailSchemaType } from '#lib'
import {
  formatSchemaErrorMessages,
  JWTCookieUtil,
  createHashedToken,
  InvalidateJwtUtil,
} from '#utils'

export const logoutController = async (
  req: Request<object, object, EmailSchemaType>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = EmailSchema.safeParse(req.body)
    if (!result.success) {
      const invalidFieldsMessage = formatSchemaErrorMessages(
        result.error.issues
      )
      return res.status(400).json({ error: invalidFieldsMessage })
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
