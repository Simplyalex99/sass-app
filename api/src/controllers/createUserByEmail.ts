import { Request, Response } from 'express'
import 'dotenv/config'
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
} from '#lib'
import { formatSchemaErrorMessages, log } from '#utils'
import { userAccountService } from 'src/lib/services/db/userAccountService'
import { RegisterUserBody } from '../../../shared/api'

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

    await userService.createUser(email)
    const userAccountPromise = userAccountService.createUser(
      email,
      plainTextPassword
    )

    const subscriptionPromise = subscriptionService.createSubscription({
      email,
      subscriptionTier: subscriptionTiers.Free.name,
    })
    await Promise.all([userAccountPromise, subscriptionPromise])

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
