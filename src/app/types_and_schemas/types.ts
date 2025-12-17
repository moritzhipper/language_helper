import z from 'zod'
import {
  BankShareSchema,
  BankUserSchema,
  CollectionBaseSchema,
  CollectionUserSchema,
  LanguageConfigSchema,
  LearnableBaseSchema,
  LearnableFromAiSchema,
  LearnableUserSchema,
  LearnableWithIdSchema
} from './schemas'

export type LearnableBase = z.infer<typeof LearnableBaseSchema>

export type Collection = z.infer<typeof CollectionBaseSchema>
export type CollectionUser = z.infer<typeof CollectionUserSchema>

export type LanguageConfig = z.infer<typeof LanguageConfigSchema>
export type BankUser = z.infer<typeof BankUserSchema>
export type BankShare = z.infer<typeof BankShareSchema>
export type BankBase = Pick<BankShare, 'name' | 'language'>

export type LearnableWithId = z.infer<typeof LearnableWithIdSchema>
export type LearnableFromAI = z.infer<typeof LearnableFromAiSchema>
export type UserLearnable = z.infer<typeof LearnableUserSchema>

export type UserLearnablePartial = Partial<UserLearnable> &
  Pick<UserLearnable, 'id'>

/** A tuple of 5 booleans representing the last 5 guess results */
export type GuessHistory = [boolean, boolean, boolean, boolean, boolean]

export type Practice = {
  index: number
  guessables: Guessable[]
  reverseDirection: boolean
}

export type LearnablesStoreType = {
  banks: BankUser[]
  activeBankId: string | null
  currentPractice: Practice | null
}

export type LearnableCreationConfig = {
  input: string
  type: 'phrases' | 'words' | 'both'
  language: LanguageConfig
}

export type Guess = 'right' | 'wrong' | 'unanswered'
export type Guessable = {
  id: string
  guessed: Guess
}

export type SettingsStoreType = {
  apiKey: string
  tokensUsed: number
}

type Optional<T> = { [K in keyof T]?: T[K] | null }

export type LearnablesFilterConfig = Optional<{
  order: 'asc' | 'desc'
  orderBy: 'created' | 'lexeme' | 'confidence' | 'random'
  type: 'word' | 'phrase'
  ids: string[]
  age: number | 'newest'
  confidence: 'medium' | 'low'
  search: string
}>

export type AppConfig = {
  fileExportName: string
  fileExportSuffix: string
  happyExpressions: string[]
  sadExpressions: string[]
}

export type BankShareResponse = {
  id: string
  expires: Date
}
