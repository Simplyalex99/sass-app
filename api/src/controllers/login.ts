import { Response, Request, NextFunction } from 'express'
import {
  LoginSchemaType,
  LoginSchema,
  userAccountService,
  userService,
} from '#lib'
import { redisClient } from '#config'
import {
  formatSchemaErrorMessages,
  isPasswordCorrect,
  createCsrfToken,
  JWTUtil,
  createHashedToken,
  mockSecureLoginAttempt,
  JWTCookieUtil,
  getLoginTimeout,
  formatTime,
} from '#utils'
import {
  INVALID_LOGIN,
  ACCOUNT_LOCKED,
  EMAIL_UNVERFIED,
  MAX_LOGIN_ATTEMPT,
  TOO_MANY_REQUEST,
  CRSF_TOKEN_EXPIRY_DATE_IN_SECONDS,
} from '#enums'
export const loginController = async (
  req: Request<object, object, LoginSchemaType>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = LoginSchema.safeParse(req.body)
    if (!result.success) {
      const invalidFieldsMessage = formatSchemaErrorMessages(
        result.error.issues
      )
      return res.status(400).json({ error: invalidFieldsMessage })
    }
    const { email, plainTextPassword } = result.data

    const services = await Promise.all([
      userAccountService.getUserByEmail(email),
      userService.getUserByEmail(email),
    ])
    const userAccounts = services[0]
    const userData = services[1]
    if (userAccounts.length === 0 || userData.length === 0) {
      mockSecureLoginAttempt()
      return res.status(401).json({ error: INVALID_LOGIN })
    }

    const userAccount = userAccounts[0]
    const { isLocked, emailIsVerified } = userData[0]
    const { passwordHash, passwordSalt, lastAttemptAt, failedAttempts } =
      userAccount
    const now = new Date(Date.now())
    if (isLocked) {
      return res.status(403).json({
        message: ACCOUNT_LOCKED,
      })
    }
    if (failedAttempts > MAX_LOGIN_ATTEMPT) {
      userService.setIsLocked(email, true)
    }
    if (lastAttemptAt !== null && failedAttempts < MAX_LOGIN_ATTEMPT) {
      const timeoutInSeconds = getLoginTimeout(failedAttempts)

      const lastAttemptInMilliseconds = lastAttemptAt.getTime()
      const currentTimeInMilliseconds = now.getTime()
      const timeElapsedInSeconds = Math.floor(
        (currentTimeInMilliseconds - lastAttemptInMilliseconds) / 1000
      )
      if (timeElapsedInSeconds < timeoutInSeconds) {
        const remainningLockoutTime = timeoutInSeconds - timeElapsedInSeconds
        const formattedTimeout = formatTime(remainningLockoutTime)
        const lockedUntil = TOO_MANY_REQUEST(formattedTimeout)
        return res.status(429).json({
          message: `Too many failed attempts. Try again in ${lockedUntil}.`,
        })
      }
    }

    if (!isPasswordCorrect(plainTextPassword, passwordHash, passwordSalt)) {
      userAccountService.addFailedAttempt(email, now)
      return res.status(401).json({ error: INVALID_LOGIN })
    }
    if (!emailIsVerified) {
      return res
        .status(200)
        .json({ error: EMAIL_UNVERFIED, isEmailVerified: false })
    }

    const csrfToken = createCsrfToken()
    const hashedCsrfToken = createHashedToken(csrfToken)
    redisClient.set(email, hashedCsrfToken, {
      EX: CRSF_TOKEN_EXPIRY_DATE_IN_SECONDS,
    })

    const accessToken = JWTUtil.createAccessToken({ email })
    const refreshToken = JWTUtil.createRefreshToken({ email })
    const jwtUtilCookie = new JWTCookieUtil()
    jwtUtilCookie.saveCookie(res, [accessToken, refreshToken])
    return res.status(200).send({ csrfToken, email, isEmailVerified: true })
  } catch (err) {
    next(err)
  }
}
