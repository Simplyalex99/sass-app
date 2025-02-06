import {
  userAccountService,
  verificationTokenService,
  EmailService,
} from '#lib'
import { BUSINESS_NAME } from '#enums'
import { createOneTimePasscode } from '../tokens/createOneTimePasscode'
const MAX_FAILED_ATTEMPTS = 3
const MAX_FAILED_SESSIONS = 2
const verificationErrorState = {
  invalidCode: 'Invalid code',
  locked: 'Account locked. Please contact support',
  temporarilyLocked: (remainningMinutesLocked: number) =>
    `Account locked. Try again later in ${remainningMinutesLocked} minutes`,
  codeExpired: 'Code expired. Request a new one',
}
export const verifyOTP = async (
  email: string,
  oneTimePasscode: string
): Promise<{
  isSuccessful: boolean
  error?: string
  httpStatusCode: number
}> => {
  const databaseRequestPromise = await Promise.all([
    verificationTokenService.getUserByEmail(email),
    userAccountService.getUserByEmail(email),
  ])
  const tokenDataList = databaseRequestPromise[0]
  const users = databaseRequestPromise[1]

  const defaultState = {
    isSuccessful: false,
    error: undefined,
    httpStatusCode: 400,
  }
  if (tokenDataList.length === 0 || users.length === 0) {
    return {
      ...defaultState,
      error: verificationErrorState.invalidCode,
    }
  }
  const user = users[0]
  if (user.isLocked) {
    return {
      ...defaultState,
      httpStatusCode: 403,
      error: verificationErrorState.locked,
    }
  }
  const tokenData = tokenDataList[0]
  const {
    otp,
    lockUntil,
    otpExpiresAt,
    failedAttempts,
    failedAttemptSessions,
  } = tokenData
  const now = new Date()
  const currentDate = new Date(now.getTime())

  if (lockUntil !== null && lockUntil > currentDate) {
    const remainningMinutesLocked = lockUntil.getMinutes()
    return {
      ...defaultState,
      httpStatusCode: 401,
      error: verificationErrorState.temporarilyLocked(remainningMinutesLocked),
    }
  }
  if (otpExpiresAt !== null && otpExpiresAt < currentDate) {
    return {
      ...defaultState,
      error: verificationErrorState.codeExpired,
    }
  }

  if (otp === oneTimePasscode) {
    verificationTokenService.deleteOneTimePasscode(email)
    return { isSuccessful: true, httpStatusCode: 200 }
  }

  if (failedAttempts < MAX_FAILED_ATTEMPTS) {
    await verificationTokenService.penalizeFailedAttempt(email)
    return { ...defaultState, error: verificationErrorState.invalidCode }
  }

  if (failedAttemptSessions > MAX_FAILED_SESSIONS) {
    await userAccountService.setIsLocked(email, true)
  }
  const fifteenMinutesLocked = new Date(now.getTime() + 15 * 60 * 1000)

  verificationTokenService.lockAndPenalizeFailedAttempSession(
    email,
    fifteenMinutesLocked
  )

  return { ...defaultState, error: verificationErrorState.invalidCode }
}
export const sendVerificationEmail = async (
  sender: string,
  receiptients: string[],
  emailVerificationHtml: string
) => {
  const emailService = new EmailService()
  const emailSubject = `${BUSINESS_NAME}: Verifcation Code`
  const result = emailService.sendEmail(
    sender,
    receiptients,
    emailSubject,
    emailVerificationHtml
  )
  return result
}

export const createEmailVerificationRequest = async (email: string) => {
  const oneTimePassCode = createOneTimePasscode().toString()
  await verificationTokenService.deleteOneTimePasscode(email)
  const now = new Date()
  const expiresAtTenMinutes = new Date(now.getTime() + 10 * 60 * 1000)
  await verificationTokenService.createOneTimePasscode(
    email,
    oneTimePassCode,
    expiresAtTenMinutes
  )
  return { otp: oneTimePassCode, otpExpiresAt: expiresAtTenMinutes }
}
