import {
  LearnablesStoreType,
  SettingsStoreType
} from '../types_and_schemas/types'

export const initialLearnables: LearnablesStoreType = {
  learnables: [],
  currentPractice: null,
  isConverting: false
}
export const initialSettings: SettingsStoreType = {
  apiKey: '',
  learningLang: 'dutch',
  speakingLang: 'english',
  tokensUsed: 0
}
