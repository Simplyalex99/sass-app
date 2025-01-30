import { z } from 'zod'
export const LoginUserSchema = z.object({
  email: z.string({ message: 'Missing required field email' }),
  plainTextPassword: z.string({ message: 'Missing required field password' }),
})
export type LoginUserSchemaType = z.infer<typeof LoginUserSchema>
