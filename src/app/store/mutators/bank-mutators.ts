import {
  BankBase,
  BankShare,
  BankUser,
  LearnablesStoreType,
  UserLearnable
} from '../../types_and_schemas/types'
import { initialGuesses, updateActiveBank } from './mutator-utils'
import { learnablesMatch } from './shared-mutators'

export const updateBank =
  (base: BankBase, bankID: string) =>
  (state: LearnablesStoreType): LearnablesStoreType => ({
    ...state,
    banks: state.banks.map((b) => (b.id === bankID ? { ...b, ...base } : b))
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
      activeBankId
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
      banks: [...state.banks, newBank]
    }
  }

export const saveImportedBank =
  ({ learnables, collections }: BankShare) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank((b) => {
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
          newLearnables.push({
            id: newId,
            created: now,
            type: imported.type,
            lexeme: imported.lexeme,
            translation: imported.translation,
            notes: imported.notes,
            guesses: { ...initialGuesses }
          })
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
    })(state)
