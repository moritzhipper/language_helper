import { z } from 'zod'

export const LearnableFromAiSchema = z.object({
  lexeme: z.string(),
  translation: z.string()
})

export const LearnablesFromAiSchema = z.object({
  cards: z.array(LearnableFromAiSchema)
})

export const LearnableBaseSchema = LearnableFromAiSchema.extend({
  notes: z.string(),
  type: z.enum(['phrase', 'word'])
})

export const LearnableWithIdSchema = LearnableBaseSchema.extend({
  id: z.uuid(),
  collectionIds: z.array(z.uuid())
})

export const LearnableUserSchema = LearnableWithIdSchema.extend({
  created: z.date(),
  guesses: z.object({
    lexeme: z.array(z.boolean()).length(5),
    translation: z.array(z.boolean()).length(5)
  })
})

export const CollectionBaseSchema = z.object({
  name: z.string(),
  id: z.string()
})

export const CollectionUserSchema = CollectionBaseSchema.extend({
  created: z.date()
})

export const BankBaseSchema = z.object({
  id: z.string(),
  language: z.object({
    spaking: z.string(),
    learning: z.string()
  }),
  learnables: z.array(LearnableWithIdSchema),
  collections: z.array(CollectionBaseSchema)
})

export const BankUserSchema = BankBaseSchema.extend({
  learnables: z.array(LearnableUserSchema),
  collections: z.array(CollectionUserSchema)
})

export const BankOfflineExportSchema = z.object({
  expires: z.date(),
  created: z.date(),
  name: z.string(),
  bank: BankBaseSchema
})

export const BankOnlineExportSchema = BankOfflineExportSchema.extend({
  id: z.uuid()
})
