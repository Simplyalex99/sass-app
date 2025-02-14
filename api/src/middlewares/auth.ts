import { Request, Response, NextFunction } from 'express'
import { ACCESS_TOKEN_KEY } from '#enums'
import { JWTUtil, createHashedToken, InvalidateJwtUtil } from '#utils'

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookies = req?.cookies

    if (!cookies) {
      res.status(401).send()
    }

    const accessToken = cookies[ACCESS_TOKEN_KEY]
    if (!accessToken) {
      res.status(401).send()
    }

    JWTUtil.verifyAccessToken(accessToken)
    const hashedAccessToken = createHashedToken(accessToken)

    const invalidAccessToken =
      await InvalidateJwtUtil.getInvalidToken(hashedAccessToken)
    if (invalidAccessToken !== null) {
      res.status(401).send()
      return
    }
    next()
  } catch (err) {
    if (err instanceof Error && err.stack) {
      next(err)
    }
    res.status(401).send()
  }
}
