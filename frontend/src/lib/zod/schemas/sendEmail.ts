import { z } from 'zod'
export const SendEmailSchema = z.object({
  userId: z.string({ message: 'Missing required field userId' }),
})
export type SendEmailSchemaType = z.infer<typeof SendEmailSchema>
