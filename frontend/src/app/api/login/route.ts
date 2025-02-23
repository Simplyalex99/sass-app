import { NextResponse } from 'next/server'
import {
  formatSchemaErrorMessages,
  isPasswordCorrect,
  JWTUtil,
  mockSecureLoginAttempt,
  JWTCookieUtil,
  getLoginTimeout,
  formatTime,
  userAccountService,
  userService,
  log,
} from '@/utils'
import {
  INVALID_LOGIN,
  ACCOUNT_LOCKED,
  EMAIL_UNVERFIED,
  MAX_LOGIN_ATTEMPT,
  TOO_MANY_REQUEST,
  INTERNAL_SERVER_ERROR,
} from '@/constants'
import { LoginBody } from '@/types/api'
import { LoginSchema } from '@/lib'
export const POST = async (req: Request): Promise<NextResponse<LoginBody>> => {
  try {
    const result = LoginSchema.safeParse(req.body)
    if (!result.success) {
      const invalidFieldsMessage = formatSchemaErrorMessages(
        result.error.issues
      )
      return NextResponse.json({ error: invalidFieldsMessage }, { status: 400 })
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
      return NextResponse.json({ error: INVALID_LOGIN }, { status: 401 })
    }

    const userAccount = userAccounts[0]
    const { isLocked, emailIsVerified } = userData[0]
    const {
      passwordHash,
      passwordSalt,
      lastAttemptAt,
      failedAttempts,
      userId,
    } = userAccount
    const now = new Date(Date.now())
    if (isLocked) {
      return NextResponse.json(
        {
          error: ACCOUNT_LOCKED,
        },
        { status: 403 }
      )
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
        return NextResponse.json(
          {
            error: `Too many failed attempts. Try again in ${lockedUntil}.`,
          },
          { status: 429 }
        )
      }
    }

    if (!isPasswordCorrect(plainTextPassword, passwordHash, passwordSalt)) {
      userAccountService.addFailedAttempt(email, now)
      return NextResponse.json({ error: INVALID_LOGIN }, { status: 401 })
    }
    if (!emailIsVerified) {
      return NextResponse.json(
        { error: EMAIL_UNVERFIED, isEmailVerified: false },
        { status: 200 }
      )
    }
    const accessToken = JWTUtil.createAccessToken({ userId })
    const refreshToken = JWTUtil.createRefreshToken({ userId })
    const jwtUtilCookie = new JWTCookieUtil()
    jwtUtilCookie.saveCookie([accessToken, refreshToken])
    return NextResponse.json(
      {
        user: {
          isEmailVerified: true,
          data: { userId, withOauthLogin: false },
        },
      },
      { status: 200 }
    )
  } catch (err) {
    log.error(err)
    return NextResponse.json(
      {
        error: INTERNAL_SERVER_ERROR,
      },
      { status: 500 }
    )
  }
}
