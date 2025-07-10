import { z } from 'zod'

// add grammatial info here
export const LearnableBaseSchema = z.object({
  lexeme: z.string(),
  translation: z.string(),
  type: z.enum(['word', 'phrase']),
  notes: z.string()
})

export const LearnableResonseSchema = z.object({
  learnables: z.array(LearnableBaseSchema)
})
