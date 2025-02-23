import { z } from 'zod'
export const EmailSchema = z.object({
  email: z.string({ message: 'Missing required field email' }),
})
export type EmailSchemaType = z.infer<typeof EmailSchema>
