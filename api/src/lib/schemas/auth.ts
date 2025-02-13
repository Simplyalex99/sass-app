import { z } from 'zod'
export const AuthSchema = z.object({
  csrf: z.string({ message: 'Missing required field csrf' }),
  email: z.string({ message: 'Missing required field email' }),
})
export type AuthSchemaType = z.infer<typeof AuthSchema>
