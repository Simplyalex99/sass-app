import { NextResponse } from 'next/server'
import { MagicLinkSchema } from '@/lib/zod/schemas/magicLink'
import {
  formatSchemaErrorMessages,
  verifyOTP,
  userService,
  log,
} from '@/utils/index'
import { VerifyEmailBody } from '@/types/api'
import { INTERNAL_SERVER_ERROR } from '@/constants/errorStatusCodeMessages'

export const POST = async (
  request: Request
): Promise<NextResponse<VerifyEmailBody>> => {
  try {
    const result = MagicLinkSchema.safeParse(request.body)
    if (!result.success) {
      const invalidFieldsMessage = formatSchemaErrorMessages(
        result.error.issues
      )
      return NextResponse.json({ error: invalidFieldsMessage }, { status: 400 })
    }

    const { email, oneTimePasscode } = result.data
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
