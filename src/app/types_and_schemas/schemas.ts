import { z } from 'zod'

export const LearnableFromAiSchema = z.object({
  lexeme: z.string(),
  translation: z.string()
})

export const LearnablesFromAiSchema = z.object({
  cards: z.array(LearnableFromAiSchema)
})

export const LearnableBaseSchema = LearnableFromAiSchema.extend({
  type: z.enum(['phrase', 'word']),
  notes: z.string()
})

export const LearnableWithIdSchema = LearnableBaseSchema.extend({
  id: z.uuid()
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
  id: z.string(),
  cardIds: z.array(z.uuid())
})

export const CollectionUserSchema = CollectionBaseSchema.extend({
  created: z.date()
})

export const LanguageConfigSchema = z.object({
  speaking: z.string(),
  learning: z.string()
})

export const BankBaseSchema = z.object({
  language: LanguageConfigSchema,
  id: z.string(),
  created: z.date(),
  name: z.string()
})

export const BankUserSchema = BankBaseSchema.extend({
  learnables: z.array(LearnableUserSchema),
  collections: z.array(CollectionUserSchema)
})

export const BankShareSchema = BankBaseSchema.extend({
  learnables: z.array(LearnableWithIdSchema),
  collections: z.array(CollectionBaseSchema),
  expires: z.date()
})
