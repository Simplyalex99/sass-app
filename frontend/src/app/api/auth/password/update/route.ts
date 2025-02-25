import { NextResponse } from 'next/server'
import { ResetPasswordSchema } from '@/lib/zod/schemas/resetPassword'
import {
  formatSchemaErrorMessages,
  verifyOTP,
  log,
  userAccountService,
} from '@/utils/index'
import { PasswordUpdateBody } from '@/types/api'
import { INTERNAL_SERVER_ERROR } from '@/constants/errorStatusCodeMessages'

export const POST = async (
  request: Request
): Promise<NextResponse<PasswordUpdateBody>> => {
  try {
    const body = await request.json()
    const result = ResetPasswordSchema.safeParse(body)
    if (!result.success) {
      const invalidFieldsMessage = formatSchemaErrorMessages(
        result.error.issues
      )
      return NextResponse.json({ error: invalidFieldsMessage }, { status: 400 })
    }

    const { email, otp, passwordForm } = result.data
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
