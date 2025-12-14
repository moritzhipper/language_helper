import {
  BankUser,
  LearnableBase,
  LearnablesStoreType,
  UserLearnable
} from '../../types_and_schemas/types'
import { initialGuesses } from '../initialStates'

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

export const mapBaseToUserLearnable = (
  base: LearnableBase,
  id: string = crypto.randomUUID(),
  created: Date = new Date()
): UserLearnable => ({
  id,
  created,
  type: base.type,
  lexeme: base.lexeme,
  translation: base.translation,
  notes: base.notes,
  guesses: { ...initialGuesses }
})

export const mapBaseToFullToLearnables = (
  learnableBase: LearnableBase[]
): UserLearnable[] => {
  const now = new Date()
  return learnableBase.map((l) =>
    mapBaseToUserLearnable(l, crypto.randomUUID(), now)
  )
}
