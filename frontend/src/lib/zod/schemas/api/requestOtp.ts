import { z } from 'zod'
export const RequestOTPSchema = z.object({
  userId: z.string({ message: 'Missing required field userId' }),
})
