import {
  LearnablesStoreType,
  SettingsStoreType
} from '../types_and_schemas/types'

export const initialLearnables: LearnablesStoreType = {
  collections: [],
  learnables: [],
  currentPractice: null
}
export const initialSettings: SettingsStoreType = {
  apiKey: '',
  learningLang: 'dutch',
  speakingLang: 'german',
  tokensUsed: 0
}
