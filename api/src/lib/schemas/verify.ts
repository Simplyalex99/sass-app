import { z } from 'zod'
export const VerifySchema = z.object({
  plainTextPassword: z.string({
    message: 'Missing required field plainTextPassword',
  }),
  storedHashedPassword: z.string({
    message: 'Missing required field storedHashedPassword',
  }),
  storedSalt: z.string({ message: 'Missing required field storedSalt' }),
})
export type VerifySchemaType = z.infer<typeof VerifySchema>
