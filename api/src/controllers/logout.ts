import { NextFunction, Request, Response } from 'express'
import { LogoutSchemaType, LogoutSchema } from '#lib'
import {
  formatSchemaErrorMessages,
  JWTCookieUtil,
  createHashedToken,
} from '#utils'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '#enums'
import { redisClient } from '#config'

export const logoutController = async (
  req: Request<object, object, LogoutSchemaType>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = LogoutSchema.safeParse(req.body)
    if (!result.success) {
      const invalidFieldsMessage = formatSchemaErrorMessages(
        result.error.issues
      )
      return res.status(400).json({ error: invalidFieldsMessage })
    }
    const jwtCookieUtil = new JWTCookieUtil()
    const tokens = jwtCookieUtil.readCookie(req)
    if (tokens === undefined) {
      return res.status(200).send()
    }
    jwtCookieUtil.clearCookie(res)
    const [accessToken, refreshToken] = tokens
    const { email } = result.data
    const hashedAccessToken = createHashedToken(accessToken)
    const hashedRefreshToken = createHashedToken(refreshToken)
    const whitelist = `${email}${ACCESS_TOKEN_KEY}`
    const blacklist = `${email}${REFRESH_TOKEN_KEY}`
    redisClient.rPush(whitelist, hashedAccessToken)
    redisClient.rPush(blacklist, hashedRefreshToken)
    return res.status(200).send()
  } catch (err) {
    next(err)
  }
}
