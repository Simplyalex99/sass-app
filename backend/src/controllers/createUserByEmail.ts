import { Request, Response, NextFunction } from 'express'
import { REFRESH_TOKEN_KEY, AUTHORIZATION_KEY, CSRF_TOKEN_KEY } from '#enums'
import {
  redisClient,
  userService,
  UserSchema,
  UserSchemaType,
  AppError,
} from '#lib'
import {
  formatSchemaErrorMessages,
  createCsrfToken,
  createHashedCsrfToken,
  JWTUtil,
  log,
} from '#utils'

export const createUserByEmailController = async (
  req: Request<object, object, UserSchemaType>,
  res: Response,
  next: NextFunction
) => {
  const result = UserSchema.safeParse(req.body)
  if (!result.success) {
    const errorMessage = formatSchemaErrorMessages(result.error.issues)
    return res.status(400).json({ error: errorMessage })
  }

  const { email, plainTextPassword } = result.data
  try {
    const user = await userService.getUserByEmail(email)

    if (user.length !== 0) {
      return res.status(400).json({ error: `Email already exists` })
    }

    await userService.createUser(email, plainTextPassword)
    const accessToken = JWTUtil.createAccessToken({ email })
    const refreshToken = JWTUtil.createRefreshToken({ email })
    const secureCookieOptions = {
      secure: true,
      sameSite: 'strict' as const,
    }
    const cookieMaxAge = 7 * 86400
    res.cookie(REFRESH_TOKEN_KEY, refreshToken, {
      expires: new Date(Date.now() + cookieMaxAge * 1000),
      httpOnly: true,
      ...secureCookieOptions,
    })

    res.header(AUTHORIZATION_KEY, accessToken)
    const csrfToken = createCsrfToken()
    const hashedCsrfToken = createHashedCsrfToken(csrfToken)
    await redisClient.set(email, hashedCsrfToken)

    res.cookie(CSRF_TOKEN_KEY, csrfToken, {
      ...secureCookieOptions,
      expires: new Date(Date.now() + 900 * 1000), // 15 minutes
    })
    return res.status(201).send({ id: email })
  } catch (err) {
    log.error('%O', err)
    if (err instanceof Error) {
      next(new AppError(err.message))
      return
    }
    next(new AppError())
  }
}
