import { z } from 'zod'

// add grammatial info here
export const LearnableBaseFromAiSchema = z.object({
  lexeme: z.string(),
  translation: z.string(),
  type: z.enum(['word', 'phrase'])
})

export const LearnableBaseSchema = LearnableBaseFromAiSchema.extend({
  notes: z.string()
})

export const LearnableResonseSchema = z.object({
  learnables: z.array(LearnableBaseFromAiSchema)
})
