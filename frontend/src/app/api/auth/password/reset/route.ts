import { NextResponse } from 'next/server'
import { BUSINESS_EMAIL } from '@/constants/socials'

import { formatSchemaErrorMessages } from '@/helpers/formatSchemaErrorsUtil'
import { createPasswordResetHtml } from '@/utils/others/createPasswordResetHtml'
import { log } from '@/utils/others/log'
import {
  sendVerificationEmail,
  createPasswordResetRequest,
} from '@/utils/tokens/otp'
import { userService } from '@/utils/services/db/user'
import { SendEmailSchema } from '@/lib/zod/schemas/sendEmail'

import { SendEmailBody } from '@/types/api'
import { INTERNAL_SERVER_ERROR } from '@/constants/errorStatusCodeMessages'

export const POST = async (
  request: Request
): Promise<NextResponse<SendEmailBody>> => {
  try {
    if (!BUSINESS_EMAIL) {
      throw new Error('Business email is not defined')
    }
    const body = await request.json()
    const result = SendEmailSchema.safeParse(body)
    if (!result.success) {
      const invalidFieldsMessage = formatSchemaErrorMessages(
        result.error.issues
      )
      return NextResponse.json({ error: invalidFieldsMessage }, { status: 400 })
    }

    const { email } = result.data
    const users = await userService.getUserByEmail(email)
    if (users.length === 0) {
      return NextResponse.json(
        {
          message:
            'A one-time passcode to reset your password has been emailed to the address provided.',
        },
        { status: 200 }
      )
    }

    const verificationTokenData = await createPasswordResetRequest(email, 48)
    const { otp, remainningMinutes } = verificationTokenData
    const passwordResetHtml = createPasswordResetHtml(
      otp,
      remainningMinutes.toString()
    )
    sendVerificationEmail(
      BUSINESS_EMAIL,
      [email],
      passwordResetHtml,
      'Password Reset'
    )
  } catch (err) {
    log.error(err)
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 })
  }
  return NextResponse.json(
    {
      message:
        'A one-time passcode to reset your password has been emailed to the address provided.',
    },
    { status: 200 }
  )
}
