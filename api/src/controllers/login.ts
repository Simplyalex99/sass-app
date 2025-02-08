import { Response, Request } from 'express'
import {
  LoginUserSchemaType,
  LoginUserSchema,
  userAccountService,
  redisClient,
  userService,
  AppError,
} from '#lib'
import {
  formatSchemaErrorMessages,
  isPasswordCorrect,
  createCsrfToken,
  JWTUtil,
  log,
  createHashedCsrfToken,
  mockSecureLoginAttempt,
  JWTCookieUtil,
  getLoginTimeout,
  formatTime,
} from '#utils'
import {
  INTERNAL_SERVER_ERROR,
  INVALID_LOGIN,
  ACCOUNT_LOCKED,
  EMAIL_UNVERFIED,
  MAX_LOGIN_ATTEMPT,
  TOO_MANY_REQUEST,
} from '#enums'
export const loginController = async (
  req: Request<object, object, LoginUserSchemaType>,
  res: Response
) => {
  try {
    const result = LoginUserSchema.safeParse(req.body)
    if (!result.success) {
      const invalidFieldsMessage = formatSchemaErrorMessages(
        result.error.issues
      )
      return res.status(400).json({ error: invalidFieldsMessage })
    }
    const { email, plainTextPassword } = result.data
    const users = await userAccountService.getUserByEmail(email)
    if (users.length === 0) {
      mockSecureLoginAttempt()
      return res.status(401).json({ error: INVALID_LOGIN })
    }

    const user = users[0]

    const {
      passwordHash,
      passwordSalt,
      lastAttemptAt,
      failedAttempts,
      isLocked,
    } = user
    const timeoutInSeconds = getLoginTimeout(failedAttempts)
    const now = new Date(Date.now())
    const currentTimeInSeconds = now.getSeconds()
    const lastAttemptInSeconds = lastAttemptAt?.getSeconds()
    if (isLocked) {
      return res.status(403).json({
        message: ACCOUNT_LOCKED,
      })
    }
    if (failedAttempts > MAX_LOGIN_ATTEMPT) {
      userAccountService.setIsLocked(email, true)
    }
    if (
      failedAttempts < MAX_LOGIN_ATTEMPT &&
      lastAttemptInSeconds !== undefined &&
      currentTimeInSeconds - lastAttemptInSeconds < timeoutInSeconds
    ) {
      const formattedTimeout = formatTime(lastAttemptInSeconds)
      const lockedUntil = TOO_MANY_REQUEST(formattedTimeout)
      return res.status(429).json({
        message: `Too many failed attempts. Try again in ${lockedUntil}}.`,
      })
    }
    if (!isPasswordCorrect(plainTextPassword, passwordHash, passwordSalt)) {
      userAccountService.addFailedAttempt(email, now)
      return res.status(401).json({ error: INVALID_LOGIN })
    }

    const userAccountData = await userService.getUserByEmail(email)
    if (userAccountData.length === 0) {
      return res.status(500).json({ error: INTERNAL_SERVER_ERROR })
    }
    const userAccount = userAccountData[0]
    if (!userAccount.emailIsVerified) {
      return res
        .status(200)
        .json({ error: EMAIL_UNVERFIED, isEmailVerified: false })
    }

    const csrfToken = createCsrfToken()
    const hashedCsrfToken = createHashedCsrfToken(csrfToken)
    redisClient.set(email, hashedCsrfToken, { EX: 60 })

    const accessToken = JWTUtil.createAccessToken({ email })
    const refreshToken = JWTUtil.createRefreshToken({ email })
    const jwtUtilCookie = new JWTCookieUtil()
    jwtUtilCookie.saveCookie(res, [accessToken, refreshToken])
    return res.status(200).send({ csrfToken, email, isEmailVerified: true })
  } catch (err) {
    if (err instanceof Error) {
      const appError = new AppError(err.message)
      log.error('%O', appError)
    }
    log.error(err)
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }
}
