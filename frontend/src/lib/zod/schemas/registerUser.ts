import { z } from 'zod'
import { isEmailValid } from '@/utils/helpers/isEmailValid'
import { isPasswordValid } from '@/utils/helpers/validatePasswordUtil'
export const invalidEmail = 'Invalid email address'
export const invalidPassword =
  'Password does not meet one or more of the required criterias: Password must have at least 8 characters, max 64 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
export const invalidConfirmation = 'Passwords do not match'

export const RegisterUserSchema = z.object({
  email: z
    .string({ message: 'Missing required field email' })
    .refine(isEmailValid, {
      message: invalidEmail,
    }),
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
export type RegisterUserSchemaType = z.infer<typeof RegisterUserSchema>
