import {
  BankUser,
  GuessHistory,
  LearnablesStoreType,
  SettingsStoreType
} from '../types_and_schemas/types'

const defaultBank: BankUser = {
  id: crypto.randomUUID(),
  name: 'Default Bank',
  created: new Date(),
  language: {
    speaking: 'german',
    learning: 'dutch'
  },
  collections: [],
  learnables: []
}

export const initialState: LearnablesStoreType = {
  banks: [defaultBank],
  activeBankId: defaultBank.id,
  currentPractice: null
}

export const initialSettings: SettingsStoreType = {
  apiKey: '',
  tokensUsed: 0,
  isOnboarded: false
}

/** Initial guesses for a new learnable */
export const initialGuesses: {
  lexeme: GuessHistory
  translation: GuessHistory
} = {
  lexeme: [false, false, false, false, false],
  translation: [false, false, false, false, false]
}
