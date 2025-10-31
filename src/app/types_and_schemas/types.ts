import z from 'zod'
import {
  BankExportOnlineSchema,
  BankExportSchema,
  CollectionBaseSchema,
  LearnableBaseSchema,
  LearnableCollectionWithId,
  LearnableWithIdSchema
} from './schemas'

export type LearnableBase = z.infer<typeof LearnableBaseSchema>

export type CollectionBase = z.infer<typeof CollectionBaseSchema>
export type LearnableCollectionWithId = z.infer<
  typeof LearnableCollectionWithId
>
export type BankExport = z.infer<typeof BankExportSchema>
export type BankExportOnline = z.infer<typeof BankExportOnlineSchema>
export type LearnableWithId = z.infer<typeof LearnableWithIdSchema>

export type Learnable = LearnableWithId & {
  created: Date
  guesses: {
    lexeme: boolean[]
    translation: boolean[]
  }
}

export type LearnablePartialWithId = Partial<Learnable> & Pick<Learnable, 'id'>

export type LearnableUserCollection = {
  id: string
  name: string
  created: Date
  learnableIDs: string[]
  practicedDates: Date[] // put Practices here?
}

// addedLatestIDs: string[]

export type LearnablesStoreType = {
  learnables: Learnable[]
  collections: LearnableUserCollection[]
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
}

export type Guess = {
  id: string
  isCorrect: boolean
}

export type SettingsStoreType = {
  apiKey: string
  learningLang: string
  speakingLang: string
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
