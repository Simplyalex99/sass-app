import { z } from 'zod'
export const PasswordSchema = z.object({
  plainTextPassword: z.string({ message: 'Missing required field password' }),
})
export type PasswordSchemaType = z.infer<typeof PasswordSchema>
