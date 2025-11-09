import z from 'zod'
import {
  BankBaseSchema,
  BankOfflineExportSchema,
  BankOnlineExportSchema,
  BankUserSchema,
  CollectionBaseSchema,
  CollectionUserSchema,
  LanguageConfigSchema,
  LearnableBaseSchema,
  LearnableUserSchema,
  LearnableWithIdSchema
} from './schemas'

export type LearnableBase = z.infer<typeof LearnableBaseSchema>

export type Collection = z.infer<typeof CollectionBaseSchema>
export type CollectionUser = z.infer<typeof CollectionUserSchema>

export type BankBase = z.infer<typeof BankBaseSchema>
export type LanguageConfig = z.infer<typeof LanguageConfigSchema>
export type BankExportOnline = z.infer<typeof BankOnlineExportSchema>
export type BankExportOffline = z.infer<typeof BankOfflineExportSchema>
export type BankUser = z.infer<typeof BankUserSchema>

export type LearnableWithId = z.infer<typeof LearnableWithIdSchema>

export type UserLearnable = z.infer<typeof LearnableUserSchema>

export type UserLearnablePartial = Partial<UserLearnable> &
  Pick<UserLearnable, 'id'>

export type LearnablesStoreType = {
  banks: BankUser[]
  activeBankId: string
  currentPractice: {
    ids: string[]
    index: number
    guesses: Guess[]
    reverseDirection: boolean
  } | null
}

export type LearnableCreationConfig = {
  input: string
  type: 'phrases' | 'words' | 'both'
  language: LanguageConfig
}

export type Guess = {
  id: string
  isCorrect: boolean
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
}
