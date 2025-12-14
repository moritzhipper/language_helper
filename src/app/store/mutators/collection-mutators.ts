import {
  CollectionUser,
  LearnablesStoreType
} from '../../types_and_schemas/types'
import { removeLearnables } from './bank-mutators'
import { updateActiveBank } from './mutator-utils'

const createNewCollection = (
  name: string,
  cardIds: string[]
): CollectionUser => ({
  id: crypto.randomUUID(),
  created: new Date(),
  name,
  cardIds
})

export const createCollection =
  (name: string, cardIds: string[]) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank(state, (b) => ({
      ...b,
      collections: [...b.collections, createNewCollection(name, cardIds)]
    }))

export const editCollection =
  (collectionID: string, addIDs: string[], deleteIDs: string[]) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank(state, (b) => ({
      ...b,
      collections: b.collections.map((c) => {
        if (c.id !== collectionID) return c
        const updatedCardIds = [...new Set([...c.cardIds, ...addIDs])].filter(
          (cardId) => !deleteIDs.includes(cardId)
        )
        return { ...c, cardIds: updatedCardIds }
      })
    }))

export const deleteCollection =
  (id: string, removeCards: boolean) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const activeBank = state.banks.find((b) => b.id === state.activeBankId)
    const cardIds =
      activeBank?.collections.find((c) => c.id === id)?.cardIds ?? []

    // Remove the collection
    const stateWithoutCollection = updateActiveBank(state, (b) => ({
      ...b,
      collections: b.collections.filter((c) => c.id !== id)
    }))

    // Optionally remove the cards using shared helper
    if (removeCards && cardIds.length > 0) {
      return removeLearnables(cardIds)(stateWithoutCollection)
    }

    return stateWithoutCollection
  }

export const renameCollection =
  (id: string, name: string) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    updateActiveBank(state, (b) => ({
      ...b,
      collections: b.collections.map((c) => (c.id === id ? { ...c, name } : c))
    }))
