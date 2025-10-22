import {
  BankExport,
  Learnable,
  LearnableBase,
  LearnablePartialWithId,
  LearnablesStoreType,
  LearnableUserCollection
} from '../types_and_schemas/types'
import { mapFileImportToAddableLearnables } from '../utils/import-export-utils'

export const startPractice =
  (ids: string[], reverseDirection: boolean) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    // randomize order of ids to prevent memorization of order
    const randomizedIds = [...ids].sort(() => Math.random() - 0.5)

    return {
      ...state,
      currentPractice: {
        ids: randomizedIds,
        index: 0,
        guesses: [],
        reverseDirection
      }
    }
  }

export const saveNewlyCreatedLearnables =
  (learnablesBase: LearnableBase[]) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const learnables = mapBaseToFullToLearnables(learnablesBase)
    const addedIDs = learnables.map((l) => l.id)

    return {
      ...state,
      learnables: [...learnables, ...state.learnables]
    }
  }

export const setGuess =
  (isCorrect: boolean) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const currentP = state.currentPractice

    // noop when finished or no practice
    if (!currentP || currentP.index >= currentP.ids.length) return state

    const currentLearnable = state.learnables.find(
      (l) => l.id === currentP.ids[currentP.index]
    )!

    // slice to only save last five guesses
    const updatedLearnable: Learnable = addGuessToLearnable(
      currentLearnable,
      isCorrect,
      currentP.reverseDirection
    )

    return {
      ...state,
      learnables: updateLearnableInList(updatedLearnable, state.learnables),
      currentPractice: {
        ...currentP,
        index: currentP.index + 1,
        guesses: [
          ...currentP.guesses,
          {
            id: currentP.ids[currentP.index],
            isCorrect
          }
        ]
      }
    }
  }

export const removeLearnables =
  (ids: string[]) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const learnables = state.learnables.filter((l) => !ids.includes(l.id))
    const remainingIDs = learnables.map((l) => l.id)

    // remove all dead ids from collections
    const collections = state.collections.map((c) => ({
      ...c,
      learnableIDs: c.learnableIDs.filter((id) => remainingIDs.includes(id))
    }))

    // reset practice to prevent lost ids and loose indexes in practice
    const currentPracticeHasDeletedIds = state.currentPractice?.ids.some((id) =>
      ids.includes(id)
    )

    if (currentPracticeHasDeletedIds) {
      return {
        ...state,
        learnables,
        collections,
        currentPractice: null
      }
    }

    return {
      ...state,
      learnables,
      collections
    }
  }

const updateLearnableInList = (
  updatedLearnable: Learnable,
  learnables: Learnable[]
): Learnable[] => {
  return learnables.map((l) => {
    if (l.id !== updatedLearnable.id) return l
    return {
      ...l,
      ...updatedLearnable
    }
  })
}

export const updateLearnables =
  (updatedL: LearnablePartialWithId[]) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const learnables = state.learnables.map((l) => {
      const updated = updatedL.find((ul) => ul.id === l.id)
      return mergeLearnables(l, updated)
    })

    return {
      ...state,
      learnables
    }
  }

const mergeLearnables = (
  lbase: Learnable,
  lmerge?: LearnablePartialWithId
): Learnable => {
  if (!lmerge) return lbase

  return {
    ...lbase,
    ...lmerge
  }
}

export const saveImportedCollections =
  (storeImport: BankExport) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const { learnables: newLearnables, collections: newCollections } =
      mapFileImportToAddableLearnables(storeImport, state.learnables)

    return {
      ...state,
      learnables: [...newLearnables, ...state.learnables],
      collections: [...newCollections, ...state.collections]
    }
  }

const mapBaseToFullToLearnables = (
  learnableBase: LearnableBase[]
): Learnable[] => {
  const now = new Date()
  return learnableBase.map((l) => ({
    id: crypto.randomUUID(),
    created: now,
    type: l.type,
    lexeme: l.lexeme,
    translation: l.translation,
    notes: l.notes,
    guesses: {
      lexeme: [false, false, false, false, false],
      translation: [false, false, false, false, false]
    }
  }))
}

const addGuessToLearnable = (
  learnable: Learnable,
  isCorrect: boolean,
  reverseDirection: boolean
): Learnable => {
  const updateGuesses = (guesses: boolean[], isCorrect: boolean): boolean[] => [
    ...guesses.slice(1),
    isCorrect
  ]

  if (!reverseDirection) {
    return {
      ...learnable,
      guesses: {
        ...learnable.guesses,
        translation: updateGuesses(learnable.guesses.translation, isCorrect)
      }
    }
  } else {
    return {
      ...learnable,
      guesses: {
        ...learnable.guesses,
        lexeme: updateGuesses(learnable.guesses.lexeme, isCorrect)
      }
    }
  }
}

export const quitPracticeEarly =
  () =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const currentPractice = state.currentPractice
    if (!currentPractice) return state

    return {
      ...state,
      currentPractice: {
        ...currentPractice,
        index: currentPractice.ids.length
      }
    }
  }

export const quitPractice =
  () =>
  (state: LearnablesStoreType): LearnablesStoreType => ({
    ...state,
    currentPractice: null
  })

export const createCollection =
  (name: string, ids: string[]) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    return {
      ...state,
      collections: [...state.collections, createNewCollection(name, ids)]
    }
  }

export const editCollection =
  (collectionID: string, addIDs: string[], deleteIDs: string[]) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const collections = state.collections.map((c) => {
      if (c.id !== collectionID) return c

      const updatedLearnables = [
        ...new Set([
          ...c.learnableIDs.filter((id) => !deleteIDs.includes(id)),
          ...addIDs
        ])
      ]

      return {
        ...c,
        learnableIDs: updatedLearnables
      }
    })

    return {
      ...state,
      collections
    }
  }

export const deleteCollection =
  (id: string) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const collections = state.collections.filter((c) => c.id !== id)

    return {
      ...state,
      collections
    }
  }

export const renameCollection =
  (id: string, name: string) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const collections = state.collections.map((c) => {
      if (c.id !== id) return c

      return {
        ...c,
        name
      }
    })

    return {
      ...state,
      collections
    }
  }

const createNewCollection = (
  name: string,
  ids: string[]
): LearnableUserCollection => ({
  id: crypto.randomUUID(),
  created: new Date(),
  name,
  learnableIDs: ids,
  practicedDates: []
})
