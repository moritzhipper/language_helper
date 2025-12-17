import {
  BankBase,
  BankShare,
  BankUser,
  LearnablesStoreType,
  UserLearnable
} from '../../types_and_schemas/types'
import {
  learnablesMatch,
  mapBaseToUserLearnable,
  updateActiveBank
} from './mutator-utils'

// Helper to check if practice should be reset when cards are deleted
const shouldResetPractice = (
  state: LearnablesStoreType,
  idsToDelete: string[]
): boolean =>
  state.currentPractice?.guessables.some((g) => idsToDelete.includes(g.id)) ??
  false

// Remove learnables from the active bank
const removeLearnablesFromBank = (
  state: LearnablesStoreType,
  idsToDelete: string[]
): LearnablesStoreType => {
  const updatedState = updateActiveBank(state, (b) => ({
    ...b,
    learnables: b.learnables.filter((l) => !idsToDelete.includes(l.id)),
    collections: b.collections.map((c) => ({
      ...c,
      cardIds: c.cardIds.filter((cardId) => !idsToDelete.includes(cardId))
    }))
  }))

  return {
    ...updatedState,
    currentPractice: shouldResetPractice(state, idsToDelete)
      ? null
      : state.currentPractice
  }
}

export const removeLearnables =
  (ids: string[]) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    removeLearnablesFromBank(state, ids)

export const updateBank =
  (base: BankBase, bankID: string) =>
  (state: LearnablesStoreType): LearnablesStoreType => ({
    ...state,
    banks: state.banks.map((b) => (b.id === bankID ? { ...b, ...base } : b))
  })

export const setActiveBank =
  (id: string) =>
  (state: LearnablesStoreType): LearnablesStoreType => ({
    ...state,
    activeBankId: id,
    currentPractice: null
  })

export const deleteBank =
  (id: string) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    // do not allow deleting the only bank
    if (state.banks.length === 1) {
      console.warn('Cannot delete bank if its the only one.')
      return state
    }

    // remove the bank
    const banks = state.banks.filter((b) => b.id !== id)

    // set id of active bank to existing bank if the active bank is deleted
    const activeBankId =
      state.activeBankId !== id ? state.activeBankId : banks[0].id

    return {
      ...state,
      banks,
      activeBankId,
      currentPractice: null
    }
  }

export const createBank =
  (base: BankBase) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const newBank: BankUser = {
      id: crypto.randomUUID(),
      name: base.name,
      created: new Date(),
      language: base.language,
      collections: [],
      learnables: []
    }

    return {
      ...state,
      activeBankId: newBank.id,
      banks: [...state.banks, newBank],
      currentPractice: null
    }
  }

export const saveImportedBank =
  ({ learnables, collections }: BankShare) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank(state, (b) => {
      const now = new Date()

      // Build a map from imported card id -> existing card id (for duplicates)
      // and identify which cards are truly new
      const importedIdToExistingId = new Map<string, string>()
      const newLearnables: UserLearnable[] = []

      for (const imported of learnables) {
        const existingMatch = b.learnables.find((existing) =>
          learnablesMatch(existing, imported)
        )
        if (existingMatch) {
          // Duplicate: map imported id to existing id
          importedIdToExistingId.set(imported.id, existingMatch.id)
        } else {
          // New card: create full UserLearnable
          const newId = crypto.randomUUID()
          importedIdToExistingId.set(imported.id, newId)
          newLearnables.push(mapBaseToUserLearnable(imported, newId, now))
        }
      }

      // Process collections: merge into existing or create new
      const updatedCollections = [...b.collections]
      for (const importedCol of collections) {
        // Remap cardIds from imported ids to actual ids (existing or new)
        // Filter out any cardIds that don't have a corresponding learnable
        const remappedCardIds = importedCol.cardIds
          .map((id) => importedIdToExistingId.get(id))
          .filter((id) => id !== undefined)

        const existingCol = updatedCollections.find(
          (c) => c.name === importedCol.name
        )
        if (existingCol) {
          // Merge cardIds into existing collection
          existingCol.cardIds = [
            ...new Set([...existingCol.cardIds, ...remappedCardIds])
          ]
        } else {
          // Create new collection with remapped cardIds
          updatedCollections.push({
            id: crypto.randomUUID(),
            name: importedCol.name,
            cardIds: remappedCardIds,
            created: now
          })
        }
      }

      return {
        ...b,
        learnables: [...b.learnables, ...newLearnables],
        collections: updatedCollections
      }
    })
