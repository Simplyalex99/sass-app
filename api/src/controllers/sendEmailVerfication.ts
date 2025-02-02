import { Request, Response } from 'express'
import 'dotenv/config'
import { INTERNAL_SERVER_ERROR, BUSINESS_EMAIL, BUSINESS_NAME } from '#enums'
import {
  AppError,
  EmailService,
  createEmailVerificationHtml,
  SendEmailSchema,
  SendEmailSchemaType,
} from '#lib'
import { formatSchemaErrorMessages, log, createOneTimePasscode } from '#utils'
import { userAccountService } from 'src/lib/services/db/userAccountService'
import { SendEmailBody } from '#types'

export const sendEmailValidationController = async (
  req: Request<object, object, SendEmailSchemaType>,
  res: Response<SendEmailBody>
) => {
  if (!BUSINESS_EMAIL) {
    throw new Error('Business email is not defined')
  }
  const result = SendEmailSchema.safeParse(req.body)
  if (!result.success) {
    const invalidFieldsMessage = formatSchemaErrorMessages(result.error.issues)
    return res.status(400).json({ error: invalidFieldsMessage })
  }

  const { email } = result.data

  try {
    const emailVerificationToken = createOneTimePasscode()
    const emailVerificationHtml = createEmailVerificationHtml(
      emailVerificationToken
    )
    await userAccountService.createOneTimePasscode(
      email,
      emailVerificationToken
    )
    const emailService = new EmailService()
    const emailSubject = `${BUSINESS_NAME}: Verifcation Code`
    const { error } = await emailService.sendEmail(
      BUSINESS_EMAIL,
      [email],
      emailSubject,
      emailVerificationHtml
    )
    if (error) {
      log.error(error.message)
      return res.status(500).json({ error: error.message })
    }
    res.status(201)
    return res.send()
  } catch (err) {
    if (err instanceof Error) {
      const appError = new AppError(err.message)
      log.error('%O', appError)
    }
    log.error(err)
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }
}
