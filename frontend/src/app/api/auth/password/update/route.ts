import { NextResponse } from 'next/server'
import { PasswordUpdateSchema } from '@/lib/zod/schemas/updatePassword'

import { formatSchemaErrorMessages } from '@/helpers/formatSchemaErrorsUtil'
import { log } from '@/utils/others/log'
import { userAccountService } from '@/utils/services/db/userAccount'
import { verificationTokenService } from '@/utils/services/db/verificationToken'
import { verifyOTP } from '@/utils/tokens/otp'

import { PasswordUpdateBody } from '@/types/api'
import { INTERNAL_SERVER_ERROR } from '@/constants/errorStatusCodeMessages'

export const POST = async (
  request: Request
): Promise<NextResponse<PasswordUpdateBody>> => {
  try {
    const body = await request.json()
    const result = PasswordUpdateSchema.safeParse(body)
    if (!result.success) {
      const invalidFieldsMessage = formatSchemaErrorMessages(
        result.error.issues
      )
      return NextResponse.json({ error: invalidFieldsMessage }, { status: 400 })
    }

    const { otp, passwordForm } = result.data
    const verificationData =
      await verificationTokenService.getUserEmailByToken(otp)
    if (verificationData.length === 0) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }
    const email = verificationData[0].email
    const { httpStatusCode, error, isSuccessful } = await verifyOTP(email, otp)
    if (!isSuccessful) {
      return NextResponse.json({ error }, { status: httpStatusCode })
    }
    await userAccountService.updatePassword(
      email,
      passwordForm.plainTextPassword
    )
  } catch (err) {
    log.error(err)
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 })
  }
  return NextResponse.json({}, { status: 200 })
}
