import z from 'zod'
import { LearnableBaseFromAiSchema, LearnableBaseSchema } from './schemas'

export type LearnableBaseFromAi = z.infer<typeof LearnableBaseFromAiSchema>
export type LearnableBase = z.infer<typeof LearnableBaseSchema>

export type Learnable = {
  id: string
  created: Date
  type: LearnableBaseFromAi['type']
  notes: string
  lexeme: string
  translation: string
  guesses: {
    lexeme: boolean[]
    translation: boolean[]
  }
}

export type LearnablePartialWithId = Partial<Learnable> & Pick<Learnable, 'id'>

export type LearnablesStoreType = {
  learnables: Learnable[]
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
  order: 'asc' | 'desc'
  orderBy: 'created' | 'lexeme' | 'confidence' | 'random'
  type: 'word' | 'phrase' | 'all'
  age?: 'newerThanOneDay' | 'all'
  confidence?: 'high' | 'medium' | 'low' | 'all'
  search: string
}
