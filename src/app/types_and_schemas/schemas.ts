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

export const LearnableWithIdSchema = LearnableBaseSchema.extend({
  id: z.uuid()
})

export const CollectionBaseSchema = z.object({
  name: z.string(),
  learnableIDs: z.array(z.uuid())
})

export const LearnableCollectionWithId = CollectionBaseSchema.extend({
  id: z.string()
})

export const BankExportSchema = z.object({
  name: z.string(),
  learnables: z.array(LearnableWithIdSchema),
  collections: z.array(CollectionBaseSchema)
})

export const BankExportOnlineSchema = BankExportSchema.extend({
  expires: z.date(),
  created: z.date(),
  id: z.uuid()
})
