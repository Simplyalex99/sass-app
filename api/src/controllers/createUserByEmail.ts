import { Request, Response } from 'express'
import {
  INTERNAL_SERVER_ERROR,
  EMAIL_ALREADY_EXISTS,
  subscriptionTiers,
} from '#enums'
import {
  userService,
  RegisterUserSchema,
  RegisterUserSchemaType,
  AppError,
  subscriptionService,
  EmailService,
  createEmailVerificationHtml,
} from '#lib'
import { formatSchemaErrorMessages, log, createOneTimePasscode } from '#utils'
export type RegisterUserBody = {
  error?: string
}

export const createUserByEmailController = async (
  req: Request<object, object, RegisterUserSchemaType>,
  res: Response<RegisterUserBody>
) => {
  const result = RegisterUserSchema.safeParse(req.body)
  if (!result.success) {
    const invalidFieldsMessage = formatSchemaErrorMessages(result.error.issues)
    return res.status(400).json({ error: invalidFieldsMessage })
  }

  const { email, passwordForm } = result.data
  const { plainTextPassword } = passwordForm
  try {
    const user = await userService.getUserByEmail(email)

    if (user.length !== 0) {
      return res.status(400).json({ error: EMAIL_ALREADY_EXISTS })
    }

    await userService.createUser(email, plainTextPassword)
    await subscriptionService.createSubscription({
      email,
      tier: subscriptionTiers.Free.name,
    })
    const emailVerificationToken = createOneTimePasscode()
    const emailVerificationHtml = createEmailVerificationHtml(
      emailVerificationToken
    )
    EmailService.getInstance().sendEmail(
      'Acme <onboarding@resend.dev>',
      ['alexm5492@gmail.com'],
      'Email Testing',
      emailVerificationHtml
    )
    return res.status(201)
  } catch (err) {
    if (err instanceof Error) {
      const appError = new AppError(err.message)
      log.error('%O', appError)
    }
    log.error(err)
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }
}
