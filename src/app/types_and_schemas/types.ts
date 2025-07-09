import z from 'zod'
import { LearnableBaseSchema } from './schemas'

export type LearnableBase = z.infer<typeof LearnableBaseSchema>

export type Learnable = {
  id: string
  linkedIds: string[]
  notes: string
  lastGuesses: boolean[]
  created: Date
} & LearnableBase

export type LearnablesStoreType = {
  learnables: Learnable[]
  currentPractice: {
    ids: string[]
    index: number
    guesses: Guess[]
  } | null
  isConverting: boolean
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
  orderBy: 'created' | 'lexeme' | 'wrongGuesses' | 'random'
  type: 'word' | 'phrase' | 'all'
  age?: 'newerThanOneDay' | 'all'
  maxAmountWrongGuesses?: number
  partial: string
}
