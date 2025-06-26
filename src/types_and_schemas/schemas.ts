import { z } from 'zod'

export const LearnableBaseSchema = z.object({
  lexeme: z.string(),
  plural: z.string().nullable(),
  meaning: z.string(),
})
