import {
  BankUser,
  GuessHistory,
  LearnableBase,
  LearnablesStoreType,
  UserLearnable
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
export const updateActiveBank = (
  state: LearnablesStoreType,
  updater: (bank: BankUser) => BankUser
): LearnablesStoreType => ({
  ...state,
  banks: state.banks.map((b) => (b.id === state.activeBankId ? updater(b) : b))
})

export const learnablesMatch = (l1: LearnableBase, l2: LearnableBase) =>
  l1.lexeme === l2.lexeme && l1.translation === l2.translation

export const mapBaseToFullToLearnables = (
  learnableBase: LearnableBase[]
): UserLearnable[] => {
  const now = new Date()
  return learnableBase.map((l) => ({
    id: crypto.randomUUID(),
    created: now,
    type: l.type,
    lexeme: l.lexeme,
    translation: l.translation,
    notes: l.notes,
    guesses: { ...initialGuesses }
  }))
}
