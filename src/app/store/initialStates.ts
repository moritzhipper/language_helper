import {
  LearnablesStoreType,
  SettingsStoreType
} from '../types_and_schemas/types'

export const initialState = (): LearnablesStoreType => {
  const initialBankId = crypto.randomUUID()

  return {
    banks: [],
    activeBankId: '',
    currentPractice: null
  }
}

export const initialSettings: SettingsStoreType = {
  apiKey: '',
  tokensUsed: 0
}
