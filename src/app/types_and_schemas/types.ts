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
  orderBy: 'created' | 'lexeme' | 'trueGuesses' | 'random'
  type: 'word' | 'phrase' | 'all'
  minAmountTrueGuesses?: number
}
