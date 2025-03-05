import { z } from 'zod'
import { isPasswordValid } from '@/helpers/validatePasswordUtil'
import { invalidPassword, invalidConfirmation } from './registerUser'
export const ResetPasswordSchema = z.object({
  token: z.string({ message: 'Missing required field token' }),
  passwordForm: z
    .object(
      {
        plainTextPassword: z
          .string({ message: 'Missing required field password' })
          .refine(isPasswordValid, {
            message: invalidPassword,
          }),
        confirmPassword: z.string({
          message: 'Missing required field confirm password',
        }),
      },
      {
        message:
          'Missing required fields email, and passwordForm with fields plainTextPassword and confirmPassword',
      }
    )
    .refine(
      (data) => {
        return data.confirmPassword === data.plainTextPassword
      },
      {
        message: invalidConfirmation,
      }
    ),
})
