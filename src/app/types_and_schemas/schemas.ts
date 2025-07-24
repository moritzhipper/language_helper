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

export const LearnableResponseSchema = z.object({
  learnables: z.array(LearnableBaseFromAiSchema)
})

export const CollectionExportSchema = z.object({
  name: z.string(),
  learnableIDs: z.array(z.uuid())
})

export const LearnableExportSchema = LearnableBaseSchema.extend({
  id: z.uuid()
})

export const StoreExportSchema = z.object({
  learnables: z.array(LearnableExportSchema),
  collections: z.array(CollectionExportSchema)
})
