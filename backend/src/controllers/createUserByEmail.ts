import { Request, Response } from 'express'
import {
  REFRESH_TOKEN_KEY,
  AUTHORIZATION_KEY,
  CSRF_TOKEN_KEY,
  INTERNAL_SERVER_ERROR,
  EMAIL_ALREADY_EXISTS,
  REFRESH_TOKEN_EXPIRY_DATE_IN_SECONDS,
  CRSF_TOKEN_EXPIRY_DATE_IN_SECONDS,
} from '#enums'
import {
  redisClient,
  userService,
  UserSchema,
  UserSchemaType,
  AppError,
} from '#lib'
import { UserResponseBody } from '../../../shared/api'
import {
  formatSchemaErrorMessages,
  createCsrfToken,
  createHashedCsrfToken,
  JWTUtil,
  log,
  createCookieExpiryDateInMilliseconds,
} from '#utils'

export const createUserByEmailController = async (
  req: Request<object, object, UserSchemaType>,
  res: Response<UserResponseBody>
) => {
  const result = UserSchema.safeParse(req.body)
  const bodyResponse = { id: null }
  if (!result.success) {
    const invalidFieldsMessage = formatSchemaErrorMessages(result.error.issues)
    return res
      .status(400)
      .json({ ...bodyResponse, error: invalidFieldsMessage })
  }

  const { email, plainTextPassword } = result.data
  try {
    const user = await userService.getUserByEmail(email)

    if (user.length !== 0) {
      return res
        .status(400)
        .json({ ...bodyResponse, error: EMAIL_ALREADY_EXISTS })
    }

    await userService.createUser(email, plainTextPassword)
    const accessToken = JWTUtil.createAccessToken({ email })
    const refreshToken = JWTUtil.createRefreshToken({ email })
    const secureCookieOptions = {
      secure: true,
      sameSite: 'strict' as const,
    }

    res.cookie(REFRESH_TOKEN_KEY, refreshToken, {
      expires: createCookieExpiryDateInMilliseconds(
        REFRESH_TOKEN_EXPIRY_DATE_IN_SECONDS
      ),
      httpOnly: true,
      ...secureCookieOptions,
    })

    res.header(AUTHORIZATION_KEY, accessToken)
    const csrfToken = createCsrfToken()
    const hashedCsrfToken = createHashedCsrfToken(csrfToken)
    await redisClient.set(email, hashedCsrfToken)

    res.cookie(CSRF_TOKEN_KEY, csrfToken, {
      ...secureCookieOptions,
      expires: createCookieExpiryDateInMilliseconds(
        CRSF_TOKEN_EXPIRY_DATE_IN_SECONDS
      ),
    })
    return res.status(201).send({ id: email })
  } catch (err) {
    if (err instanceof Error) {
      const appError = new AppError(err.message)
      log.error('%O', appError)
    }
    log.error(err)
    return res
      .status(500)
      .json({ ...bodyResponse, error: INTERNAL_SERVER_ERROR })
  }
}
