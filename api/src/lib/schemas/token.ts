import { z } from 'zod'
export const TokenSchema = z.object({
  token: z.string({ message: 'Missing required field token' }),
})
export type TokenSchemaType = z.infer<typeof TokenSchema>
