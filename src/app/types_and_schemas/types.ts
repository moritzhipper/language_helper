import z from 'zod'
import {
  ExportedCollectionSchema,
  LearnableBaseFromAiSchema,
  LearnableBaseSchema
} from './schemas'

export type LearnableBaseFromAi = z.infer<typeof LearnableBaseFromAiSchema>
export type LearnableBase = z.infer<typeof LearnableBaseSchema>
export type ExportedCollection = z.infer<typeof ExportedCollectionSchema>

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

export type LearnablesStoreType = {
  learnables: Learnable[]
  collections: LearnableCollection[]
  addedLatestIDs: string[]
  currentPractice: {
    ids: string[]
    index: number
    guesses: Guess[]
    reverseDirection: boolean
  } | null
}

export type LearnableCreationConfig = {
  text: string
  allowWords: boolean
  allowPhrases: boolean
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

export type LearnablesFilterConfig = {
  order?: 'asc' | 'desc'
  orderBy?: 'created' | 'lexeme' | 'confidence' | 'random'
  type?: 'word' | 'phrase' | 'all'
  age?: 'newerThanOneDay' | 'all'
  confidence?: 'high' | 'medium' | 'low' | 'all'
  search?: string
}
