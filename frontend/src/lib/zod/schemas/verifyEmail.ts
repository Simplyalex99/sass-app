import { z } from 'zod'
export const VerifyEmailSchema = z.object({
  userId: z.string({ message: 'Missing required field userId' }),
})
