import { Request, Response, NextFunction } from 'express'
import { ACCESS_TOKEN_KEY } from '#enums'
import { JWTUtil } from '#utils'
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req?.cookies

  if (!cookies) {
    res.status(401).send()
  }

  const accessToken = cookies[ACCESS_TOKEN_KEY]
  if (!accessToken) {
    res.status(401).send()
  }
  try {
    JWTUtil.verifyAccessToken(accessToken)
    next()
  } catch {
    res.status(401).send()
  }
}
