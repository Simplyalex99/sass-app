import { NextFunction, Request, Response } from 'express'
import { MagicLinkSchema, MagicLinkSchemaType, userService } from '#lib'
import { formatSchemaErrorMessages, verifyOTP } from '#utils'
import { VerifyEmailBody } from '../../../shared/api'

export const verifyEmailController = async (
  req: Request<object, object, MagicLinkSchemaType>,
  res: Response<VerifyEmailBody | undefined>,
  next: NextFunction
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
    next(err)
  }
}
