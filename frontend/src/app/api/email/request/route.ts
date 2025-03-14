import { NextResponse } from 'next/server'
import { BUSINESS_EMAIL } from '@/constants/socials'
import { userAccountService } from '@/utils/services/db/userAccount'
import { log } from '@/utils/others/log'
import { RequestOTPSchema } from '@/lib/zod/schemas/api/requestOtp'

import { RequestOTPBody } from '@/types/api'
import { INTERNAL_SERVER_ERROR } from '@/constants/errorStatusCodeMessages'
import { formatSchemaErrorMessages } from '@/helpers/formatSchemaErrorsUtil'
import { createEmailVerificationHtml } from '@/utils/others/createEmailVerificationHtml'
import {
  sendVerificationEmail,
  createEmailVerificationRequest,
} from '@/utils/tokens/otp'
export const POST = async (
  request: Request
): Promise<NextResponse<RequestOTPBody>> => {
  try {
    if (!BUSINESS_EMAIL) {
      throw new Error('Business email is not defined')
    }
    const body = await request.json()
    const result = RequestOTPSchema.safeParse(body)
    if (!result.success) {
      const invalidFieldsMessage = formatSchemaErrorMessages(
        result.error.issues
      )
      return NextResponse.json({ error: invalidFieldsMessage }, { status: 400 })
    }

    const { userId } = result.data
    const account = await userAccountService.getUserById(userId)
    if (account.length === 0) {
      return NextResponse.json({}, { status: 400 })
    }
    const email = account[0].email
    const verificationTokenData = await createEmailVerificationRequest(email)
    const { otp, remainningMinutes } = verificationTokenData

    const emailVerificationHtml = createEmailVerificationHtml(
      otp,
      remainningMinutes.toString()
    )
    sendVerificationEmail(BUSINESS_EMAIL, [email], emailVerificationHtml)
  } catch (err) {
    log.error(err)
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 })
  }
  return NextResponse.json(
    {
      message:
        'A one-time passcode to activate your account has been emailed to the address provided.',
    },
    { status: 200 }
  )
}
