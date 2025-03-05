import { NextResponse } from 'next/server'
import { MagicLinkSchema } from '@/lib/zod/schemas/magicLink'
import { userService } from '@/utils/services/db/user'
import { userAccountService } from '@/utils/services/db/userAccount'
import { log } from '@/utils/others/log'

import { formatSchemaErrorMessages } from '@/helpers/formatSchemaErrorsUtil'
import { verifyOTP } from '@/utils/tokens/otp'
import { VerifyEmailBody } from '@/types/api'
import { INTERNAL_SERVER_ERROR } from '@/constants/errorStatusCodeMessages'

export const POST = async (
  request: Request
): Promise<NextResponse<VerifyEmailBody>> => {
  try {
    const body = await request.json()
    const result = MagicLinkSchema.safeParse(body)
    if (!result.success) {
      const invalidFieldsMessage = formatSchemaErrorMessages(
        result.error.issues
      )
      return NextResponse.json({ error: invalidFieldsMessage }, { status: 400 })
    }

    const { userId, oneTimePasscode } = result.data
    const account = await userAccountService.getUserById(userId)
    if (account.length === 0) {
      return NextResponse.json({}, { status: 400 })
    }
    const email = account[0].email
    const { httpStatusCode, error, isSuccessful } = await verifyOTP(
      email,
      oneTimePasscode
    )
    if (!isSuccessful) {
      return NextResponse.json({ error }, { status: httpStatusCode })
    }
    await userService.addIsVerified(email)
  } catch (err) {
    log.error(err)
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 })
  }
  return NextResponse.json({}, { status: 200 })
}
