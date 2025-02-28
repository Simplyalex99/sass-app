import { NextResponse } from 'next/server'
import {
  EMAIL_ALREADY_EXISTS,
  subscriptionTiers,
  INTERNAL_SERVER_ERROR,
} from '@/constants'
import {
  userService,
  subscriptionService,
  userAccountService,
  formatSchemaErrorMessages,
  log,
} from '@/utils'
import { RegisterUserSchema } from '@/lib/zod/schemas/registerUser'

import { RegisterUserBody } from '@/types/api'

export const POST = async (
  request: Request
): Promise<NextResponse<RegisterUserBody>> => {
  try {
    const body = await request.json()

    const result = RegisterUserSchema.safeParse(body)
    if (!result.success) {
      const invalidFieldsMessage = formatSchemaErrorMessages(
        result.error.issues
      )
      return NextResponse.json({ error: invalidFieldsMessage }, { status: 400 })
    }

    const { email, passwordForm } = result.data
    const { plainTextPassword } = passwordForm

    const user = await userService.getUserByEmail(email)

    if (user.length !== 0) {
      return NextResponse.json({ error: EMAIL_ALREADY_EXISTS }, { status: 400 })
    }

    const userData = await userService.createUser(email)
    if (userData.length === 0) {
      return NextResponse.json(
        { error: INTERNAL_SERVER_ERROR },
        { status: 500 }
      )
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
    return NextResponse.json({ userId }, { status: 201 })
  } catch (err) {
    log.error(err)
    return NextResponse.json({}, { status: 500 })
  }
}
