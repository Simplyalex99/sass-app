import { z } from 'zod'
import { isPasswordValid, isEmailValid } from '#utils'
export const UserSchema = z.object({
  email: z
    .string({ message: 'Missing required field email' })
    .refine(isEmailValid, {
      message: 'Invalid email address',
    }),
  plainTextPassword: z
    .string({ message: 'Missing required field password' })
    .refine(isPasswordValid, {
      message:
        'Password does not meet one or more of the required criterias: Password must have at least 8 characters, max 64 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
    }),
})
export type UserSchemaType = z.infer<typeof UserSchema>
