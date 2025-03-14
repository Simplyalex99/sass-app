import { NextResponse } from 'next/server'
import {
  EMAIL_ALREADY_EXISTS,
  subscriptionTiers,
  INTERNAL_SERVER_ERROR,
  BUSINESS_EMAIL,
} from '@/constants'

import { RegisterUserSchema } from '@/lib/zod/schemas/api/registerUser'

import { RegisterUserBody } from '@/types/api'
import { formatSchemaErrorMessages } from '@/helpers/formatSchemaErrorsUtil'
import { userService } from '@/utils/services/db/user'
import { userAccountService } from '@/utils/services/db/userAccount'
import { subscriptionService } from '@/utils/services/db/subscription'
import {
  createEmailVerificationRequest,
  sendVerificationEmail,
} from '@/utils/tokens/otp'
import { createEmailVerificationHtml } from '@/utils/others/createEmailVerificationHtml'
import log from '@/utils/others/log'

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
    const verificationTokenData = await createEmailVerificationRequest(email)
    const { otp, remainningMinutes } = verificationTokenData

    const emailVerificationHtml = createEmailVerificationHtml(
      otp,
      remainningMinutes.toString()
    )
    sendVerificationEmail(BUSINESS_EMAIL, [email], emailVerificationHtml)
    await Promise.all([userAccountPromise, subscriptionPromise])
    return NextResponse.json({ userId }, { status: 201 })
  } catch (err) {
    log.error(err)
    return NextResponse.json({}, { status: 500 })
  }
}
