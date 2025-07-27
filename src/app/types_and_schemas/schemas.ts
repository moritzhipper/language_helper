import { z } from 'zod'

export const LearnablesFromAiSchema = z.object({
  cards: z.array(
    z.object({
      lexeme: z.string(),
      translation: z.string()
    })
  )
})

export const LearnableBaseSchema = z.object({
  lexeme: z.string(),
  translation: z.string(),
  notes: z.string(),
  type: z.enum(['phrase', 'word'])
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
