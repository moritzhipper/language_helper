import { LearnablesStoreType } from '../../types_and_schemas/types'
import { updateActiveBank } from './mutator-utils'
import {
  createNewCollection,
  removeLearnablesFromBank
} from './shared-mutators'

export const createCollection =
  (name: string, cardIds: string[]) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank((b) => ({
      ...b,
      collections: [...b.collections, createNewCollection(name, cardIds)]
    }))(state)

export const editCollection =
  (collectionID: string, addIDs: string[], deleteIDs: string[]) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank((b) => ({
      ...b,
      collections: b.collections.map((c) => {
        if (c.id !== collectionID) return c
        const updatedCardIds = [...new Set([...c.cardIds, ...addIDs])].filter(
          (cardId) => !deleteIDs.includes(cardId)
        )
        return { ...c, cardIds: updatedCardIds }
      })
    }))(state)

export const deleteCollection =
  (id: string, removeCards: boolean) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const activeBank = state.banks.find((b) => b.id === state.activeBankId)
    const cardIds =
      activeBank?.collections.find((c) => c.id === id)?.cardIds ?? []

    // Remove the collection
    const stateWithoutCollection = updateActiveBank((b) => ({
      ...b,
      collections: b.collections.filter((c) => c.id !== id)
    }))(state)

    // Optionally remove the cards using shared helper
    if (removeCards && cardIds.length > 0) {
      return removeLearnablesFromBank(stateWithoutCollection, cardIds)
    }

    return stateWithoutCollection
  }

export const renameCollection =
  (id: string, name: string) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank((b) => ({
      ...b,
      collections: b.collections.map((c) => (c.id === id ? { ...c, name } : c))
    }))(state)
