import { EmailService } from '../services/others/emailService'
import { userService } from '../services/db/user'
import { verificationTokenService } from '../services/db/verificationToken'
import { VERIFCATION_ERROR_STATES } from '@/constants/errorStatusCodeMessages'
import { BUSINESS_NAME } from '@/constants/socials'
import { createSixDigitOTP, createOTP } from './createOneTimePasscode'
const MAX_FAILED_ATTEMPTS = 3
const MAX_FAILED_SESSIONS = 2

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
    userService.getUserByEmail(email),
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
      error: VERIFCATION_ERROR_STATES.invalidCode,
    }
  }
  const user = users[0]
  if (user.isLocked) {
    return {
      ...defaultState,
      httpStatusCode: 403,
      error: VERIFCATION_ERROR_STATES.locked,
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
      error: VERIFCATION_ERROR_STATES.temporarilyLocked(
        remainningMinutesLocked
      ),
    }
  }
  if (otpExpiresAt !== null && otpExpiresAt < currentDate) {
    return {
      ...defaultState,
      error: VERIFCATION_ERROR_STATES.codeExpired,
    }
  }

  if (otp === oneTimePasscode) {
    verificationTokenService.deleteOneTimePasscode(email)
    return { isSuccessful: true, httpStatusCode: 201 }
  }

  if (failedAttempts < MAX_FAILED_ATTEMPTS) {
    await verificationTokenService.penalizeFailedAttempt(email)
    return { ...defaultState, error: VERIFCATION_ERROR_STATES.invalidCode }
  }

  if (failedAttemptSessions > MAX_FAILED_SESSIONS) {
    await userService.setIsLocked(email, true)
  }
  const fifteenMinutesLocked = new Date(now.getTime() + 15 * 60 * 1000)

  verificationTokenService.lockAndPenalizeFailedAttempSession(
    email,
    fifteenMinutesLocked
  )

  return { ...defaultState, error: VERIFCATION_ERROR_STATES.invalidCode }
}
export const sendVerificationEmail = async (
  sender: string,
  receiptients: string[],
  emailVerificationHtml: string,
  subject: string = 'Verifcation Code'
) => {
  const emailService = new EmailService()
  const emailSubject = `${BUSINESS_NAME}: ${subject}`
  const result = emailService.sendEmail(
    sender,
    receiptients,
    emailSubject,
    emailVerificationHtml
  )
  return result
}

export const createEmailVerificationRequest = async (email: string) => {
  const oneTimePassCode = createSixDigitOTP().toString()
  await verificationTokenService.deleteOneTimePasscode(email)
  const now = new Date()
  const expiresAtTenMinutes = new Date(Date.now() + 10 * 60 * 1000)
  const remainningMinutes = expiresAtTenMinutes.getMinutes() - now.getMinutes()

  await verificationTokenService.createOneTimePasscode(
    email,
    oneTimePassCode,
    expiresAtTenMinutes
  )
  return { otp: oneTimePassCode, remainningMinutes }
}

/**
 *
 * @param email
 *
 * @param bytes representing the length of the OTP
 * @note Max bytes is 256^6
 * @returns
 */
export const createPasswordResetRequest = async (
  email: string,
  bytes: number
) => {
  const oneTimePassCode = await createOTP(bytes)
  await verificationTokenService.deleteOneTimePasscode(email)
  const now = new Date()
  const expiresAtTenMinutes = new Date(now.getTime() + 10 * 60 * 1000)
  const remainningMinutes = expiresAtTenMinutes.getMinutes() - now.getMinutes()
  await verificationTokenService.createOneTimePasscode(
    email,
    oneTimePassCode,
    expiresAtTenMinutes
  )

  return { otp: oneTimePassCode, remainningMinutes }
}
