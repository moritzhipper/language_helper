import { z } from 'zod'

export const LearnableWordsFromAiSchema = z.object({
  vocabulary_cards: z.array(
    z.object({
      word: z.string(),
      translation: z.string()
    })
  )
})

export const LearnablePhrasesFromAiSchema = z.object({
  phrase_cards: z.array(
    z.object({
      phrase: z.string(),
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
