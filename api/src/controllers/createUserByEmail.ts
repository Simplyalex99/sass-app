import { NextFunction, Request, Response } from 'express'
import 'dotenv/config'
import {
  EMAIL_ALREADY_EXISTS,
  subscriptionTiers,
  INTERNAL_SERVER_ERROR,
} from '#enums'
import {
  userService,
  RegisterUserSchema,
  RegisterUserSchemaType,
  subscriptionService,
  userAccountService,
} from '#lib'
import { formatSchemaErrorMessages } from '#utils'
import { RegisterUserBody } from '../../../shared/api'

export const createUserByEmailController = async (
  req: Request<object, object, RegisterUserSchemaType>,
  res: Response<RegisterUserBody>,
  next: NextFunction
) => {
  try {
    const result = RegisterUserSchema.safeParse(req.body)
    if (!result.success) {
      const invalidFieldsMessage = formatSchemaErrorMessages(
        result.error.issues
      )
      return res.status(400).json({ error: invalidFieldsMessage })
    }

    const { email, passwordForm } = result.data
    const { plainTextPassword } = passwordForm

    const user = await userService.getUserByEmail(email)

    if (user.length !== 0) {
      return res.status(400).json({ error: EMAIL_ALREADY_EXISTS })
    }

    const userData = await userService.createUser(email)
    if (userData.length === 0) {
      res.status(500).json({ error: INTERNAL_SERVER_ERROR })
      return
    }
    const userId = userData[0].id
    const userAccountPromise = userAccountService.createUser(
      userId,
      email,
      plainTextPassword
    )

    const subscriptionPromise = subscriptionService.createSubscription({
      userId,
      email,
      subscriptionTier: subscriptionTiers.Free.name,
    })
    await Promise.all([userAccountPromise, subscriptionPromise])

    res.status(201)
    return res.send()
  } catch (err) {
    next(err)
  }
}
