import { NextFunction, Request, Response } from 'express'
import { EmailSchema, EmailSchemaType } from '#lib'
import {
  formatSchemaErrorMessages,
  JWTCookieUtil,
  createHashedToken,
} from '#utils'
import {
  REFRESH_TOKEN_EXPIRY_DATE_IN_SECONDS,
  ACCESS_TOKEN_EXPIRY_DATE_IN_SECONDS,
} from '#enums'
import { redisClient } from '#config'

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

    redisClient.set(hashedRefreshToken, 'blacklist', {
      EX: REFRESH_TOKEN_EXPIRY_DATE_IN_SECONDS,
    })
    redisClient.set(hashedAccessToken, 'whitelist', {
      EX: ACCESS_TOKEN_EXPIRY_DATE_IN_SECONDS,
    })
    return res.status(200).send()
  } catch (err) {
    next(err)
  }
}
