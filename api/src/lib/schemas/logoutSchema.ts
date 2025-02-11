import { z } from 'zod'
export const LogoutSchema = z.object({
  email: z.string({ message: 'Missing required field email' }),
})
export type LogoutSchemaType = z.infer<typeof LogoutSchema>
