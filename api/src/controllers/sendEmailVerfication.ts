import { NextFunction, Request, Response } from 'express'
import 'dotenv/config'
import { BUSINESS_EMAIL } from '#enums'
import {
  createEmailVerificationHtml,
  SendEmailSchema,
  SendEmailSchemaType,
} from '#lib'
import {
  formatSchemaErrorMessages,
  createEmailVerificationRequest,
  sendVerificationEmail,
} from '#utils'

import { SendEmailBody } from '../../../shared/api'

export const sendEmailValidationController = async (
  req: Request<object, object, SendEmailSchemaType>,
  res: Response<SendEmailBody | undefined>,
  next: NextFunction
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
    next(err)
  }
}
