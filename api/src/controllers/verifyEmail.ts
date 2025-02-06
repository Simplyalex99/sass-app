import { Request, Response } from 'express'
import {
  MagicLinkSchema,
  MagicLinkSchemaType,
  userService,
  AppError,
} from '#lib'
import { formatSchemaErrorMessages, verifyOTP, log } from '#utils'
import { INTERNAL_SERVER_ERROR } from '#enums'
import { VerifyEmailBody } from '../../../shared/api'

export const verifyEmailController = async (
  req: Request<object, object, MagicLinkSchemaType>,
  res: Response<VerifyEmailBody>
) => {
  try {
    const result = MagicLinkSchema.safeParse(req.body)
    if (!result.success) {
      const invalidFieldsMessage = formatSchemaErrorMessages(
        result.error.issues
      )
      return res.status(400).json({ error: invalidFieldsMessage })
    }

    const { email, oneTimePasscode } = result.data
    const { httpStatusCode, error, isSuccessful } = await verifyOTP(
      email,
      oneTimePasscode
    )
    if (!isSuccessful) {
      return res.status(httpStatusCode).json({ error })
    }
    userService.addIsVerified(email)
    return res.status(httpStatusCode).send()
  } catch (err) {
    if (err instanceof Error) {
      const appError = new AppError(err.message)
      log.error('%O', appError)
    }
    log.error(err)
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }
}
