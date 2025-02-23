import { z } from 'zod'
import { isEmailValid } from '@/utils/helpers/isEmailValid'
import { isPasswordValid } from '@/utils/helpers/isPasswordValid'
export const RegisterUserSchema = z.object({
  email: z
    .string({ message: 'Missing required field email' })
    .refine(isEmailValid, {
      message: 'Invalid email address',
    }),
  passwordForm: z
    .object(
      {
        plainTextPassword: z
          .string({ message: 'Missing required field password' })
          .refine(isPasswordValid, {
            message:
              'Password does not meet one or more of the required criterias: Password must have at least 8 characters, max 64 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
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
        message: 'Passwords do not match',
      }
    ),
})
export type RegisterUserSchemaType = z.infer<typeof RegisterUserSchema>
