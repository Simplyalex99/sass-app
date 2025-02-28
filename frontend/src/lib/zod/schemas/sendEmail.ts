import { z } from 'zod'
export const SendEmailSchema = z.object({
  email: z.string({ message: 'Missing required field email' }),
})
export type SendEmailSchemaType = z.infer<typeof SendEmailSchema>
