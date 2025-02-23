import { z } from 'zod'
export const LoginSchema = z.object({
  email: z.string({ message: 'Missing required field email' }),
  plainTextPassword: z.string({ message: 'Missing required field password' }),
})
export type LoginSchemaType = z.infer<typeof LoginSchema>
