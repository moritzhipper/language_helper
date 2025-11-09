import {
  BankUser,
  LearnablesStoreType,
  SettingsStoreType
} from '../types_and_schemas/types'

const defaultBank: BankUser = {
  id: crypto.randomUUID(),
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
  tokensUsed: 0
}
