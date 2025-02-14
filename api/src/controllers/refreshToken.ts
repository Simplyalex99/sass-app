import { NextFunction, Request, Response } from 'express'
import {
  JWTCookieUtil,
  JWTUtil,
  formatSchemaErrorMessages,
  InvalidateJwtUtil,
  createHashedToken,
} from '#utils'
import { EmailSchemaType, EmailSchema } from '#lib'
export const refreshTokenController = async (
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
    const { email } = result.data
    const jwtCookieUtil = new JWTCookieUtil()
    const tokens = jwtCookieUtil.readCookie(req)
    if (tokens === undefined) {
      return res.status(401).send()
    }
    const [, refreshToken] = tokens
    if (refreshToken === null) {
      return res.status(401).send()
    }
    const hashedRefreshToken = createHashedToken(refreshToken)
    const invalidRefreshToken =
      await InvalidateJwtUtil.getInvalidToken(hashedRefreshToken)
    if (invalidRefreshToken !== null) {
      res.status(401).send()
      return
    }
    JWTUtil.verifyRefreshToken(refreshToken)
    const newAccessToken = JWTUtil.createAccessToken({ email })
    const newRefreshToken = JWTUtil.createRefreshToken({ email })
    const oldRefreshHashedToken = createHashedToken(refreshToken)
    InvalidateJwtUtil.blacklistRefreshToken(oldRefreshHashedToken)
    jwtCookieUtil.clearCookie(res)
    jwtCookieUtil.saveCookie(res, [newAccessToken, newRefreshToken])
    return res.status(200).send()
  } catch (err) {
    next(err)
  }
}
