import {
  BankUser,
  GuessHistory,
  LearnablesStoreType
} from '../../types_and_schemas/types'

/** Initial guesses for a new learnable */
export const initialGuesses: {
  lexeme: GuessHistory
  translation: GuessHistory
} = {
  lexeme: [false, false, false, false, false],
  translation: [false, false, false, false, false]
}

/** Helper to update the active bank in state */
export const updateActiveBank =
  (updater: (bank: BankUser) => BankUser) =>
  (state: LearnablesStoreType): LearnablesStoreType => ({
    ...state,
    banks: state.banks.map((b) =>
      b.id === state.activeBankId ? updater(b) : b
    )
  })
