import z from 'zod'
import { LearnableBaseSchema } from './schemas'

export type LearnableBase = z.infer<typeof LearnableBaseSchema>

export type Learnable = {
  id: string
  linkedIds: string[]
  lexeme: string
  plural: string
  meaning: string
  notes: string
  lastGuesses: boolean[]
}

export type VocabularyType =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'interjection'
  | 'article'
  | 'sentence'

export type LangStore = {
  settings: {
    apiKey: string
  }
  learnablesWithStats: Learnable[]
}
