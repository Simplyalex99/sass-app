import { NextResponse } from 'next/server'
import { BUSINESS_EMAIL } from '@/constants/socials'
import {
  createEmailVerificationHtml,
  formatSchemaErrorMessages,
  createEmailVerificationRequest,
  sendVerificationEmail,
  log,
  userAccountService,
} from '@/utils'
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
      return NextResponse.json(
        { error: invalidFieldsMessage, message: null },
        { status: 400 }
      )
    }

    const { userId } = result.data
    const account = await userAccountService.getUserById(userId)
    if (account.length === 0) {
      return NextResponse.json({ message: null }, { status: 400 })
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
    return NextResponse.json(
      { error: INTERNAL_SERVER_ERROR, message: null },
      { status: 500 }
    )
  }
  return NextResponse.json(
    {
      message:
        'A one-time passcode to activate your account has been emailed to the address provided.',
    },
    { status: 200 }
  )
}
