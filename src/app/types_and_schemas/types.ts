import z from 'zod'
import {
  CollectionExportSchema,
  LearnableBaseSchema,
  LearnableExportSchema,
  StoreExportSchema
} from './schemas'

export type LearnableBase = z.infer<typeof LearnableBaseSchema>

export type CollectionExport = z.infer<typeof CollectionExportSchema>
export type StoreExport = z.infer<typeof StoreExportSchema>
export type LearnableExport = z.infer<typeof LearnableExportSchema>

export type Learnable = LearnableBase & {
  id: string
  created: Date
  guesses: {
    lexeme: boolean[]
    translation: boolean[]
  }
}

export type LearnablePartialWithId = Partial<Learnable> & Pick<Learnable, 'id'>

export type LearnableCollection = {
  id: string
  name: string
  created: Date
  learnableIDs: string[]
  practicedDates: Date[] // put Practices here?
}
// addedLatestIDs: string[]

export type LearnablesStoreType = {
  learnables: Learnable[]
  collections: LearnableCollection[]
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
}
