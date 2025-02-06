import { Request, Response } from 'express'
import 'dotenv/config'
import { INTERNAL_SERVER_ERROR, BUSINESS_EMAIL } from '#enums'
import {
  AppError,
  createEmailVerificationHtml,
  SendEmailSchema,
  SendEmailSchemaType,
} from '#lib'
import {
  formatSchemaErrorMessages,
  log,
  createEmailVerificationRequest,
  sendVerificationEmail,
} from '#utils'

import { SendEmailBody } from '../../../shared/api'

export const sendEmailValidationController = async (
  req: Request<object, object, SendEmailSchemaType>,
  res: Response<SendEmailBody>
) => {
  try {
    if (!BUSINESS_EMAIL) {
      throw new Error('Business email is not defined')
    }
    const result = SendEmailSchema.safeParse(req.body)
    if (!result.success) {
      const invalidFieldsMessage = formatSchemaErrorMessages(
        result.error.issues
      )
      return res
        .status(400)
        .json({ error: invalidFieldsMessage, message: null })
    }

    const { email } = result.data

    const verificationTokenData = await createEmailVerificationRequest(email)
    const { otp, otpExpiresAt } = verificationTokenData
    const emailVerificationHtml = createEmailVerificationHtml(
      otp,
      otpExpiresAt.getMinutes().toString()
    )
    sendVerificationEmail(BUSINESS_EMAIL, [email], emailVerificationHtml)

    res.status(201)
    return res.json({
      message:
        'A one-time passcode to activate your account has been emailed to the address provided.',
    })
  } catch (err) {
    if (err instanceof Error) {
      const appError = new AppError(err.message)
      log.error('%O', appError)
    }
    log.error(err)
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR, message: null })
  }
}
