import { z } from 'zod'
export const MagicLinkSchema = z.object(
  {
    email: z.string({ message: 'Missing required field email' }),
    oneTimePasscode: z
      .string({
        message: 'Missing requied field oneTimePasscode',
      })
      .length(6, { message: 'Invalid code' }),
  },
  {
    message:
      'Missing one or more of the required fields email and oneTimePasscode',
  }
)
export type MagicLinkSchemaType = z.infer<typeof MagicLinkSchema>
