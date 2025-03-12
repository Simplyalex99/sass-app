import { z } from 'zod'
export const OtpUrlSchema = z.object({
  bytes: z.number({ message: 'Missing required field bytes' }).max(256).min(0),
})
export type OtpUrlSchemaType = z.infer<typeof OtpUrlSchema>
