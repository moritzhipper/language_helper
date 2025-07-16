import {
  Learnable,
  LearnableBase,
  LearnableCollection,
  LearnablePartialWithId,
  LearnablesStoreType
} from '../types_and_schemas/types'

export const startPractice =
  (ids: string[], reverseDirection: boolean) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    return {
      ...state,
      currentPractice: {
        ids,
        index: 0,
        guesses: [],
        reverseDirection
      }
    }
  }

export const saveNewLearnables =
  (learnablesBase: LearnableBase[]) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const learnables = mapBaseToFullToLearnables(learnablesBase)
    const filteredLearnables = filterDoubleEntries(learnables)

    return {
      ...state,
      learnables: [...filteredLearnables, ...state.learnables]
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

    return {
      ...state,
      learnables
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

  // Shallow merge only, no nested learning/translation objects
  return {
    ...lbase,
    ...lmerge
  }
}

const mapBaseToFullToLearnables = (
  learnableBase: LearnableBase[]
): Learnable[] => {
  return learnableBase.map((l) => ({
    id: crypto.randomUUID(),
    created: new Date(),
    type: l.type,
    lexeme: l.lexeme,
    translation: l.translation,
    notes: l.notes || '',
    guesses: {
      lexeme: [false, false, false, false, false],
      translation: [false, false, false, false, false]
    }
  }))
}

const filterDoubleEntries = (learnables: Learnable[]): Learnable[] => {
  const uniqueLexemes = new Set<string>()
  return learnables.filter((l) => {
    if (uniqueLexemes.has(l.lexeme)) {
      return false
    }
    uniqueLexemes.add(l.lexeme)
    return true
  })
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
    const newCollection: LearnableCollection = {
      id: crypto.randomUUID(),
      name,
      learnables: ids,
      practicedDates: []
    }

    return {
      ...state,
      collections: [...state.collections, newCollection]
    }
  }

export const editCollection =
  (collectionID: string, addIDs: string[], deleteIDs: string[]) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const collections = state.collections.map((c) => {
      if (c.id !== collectionID) return c

      const updatedLearnables = c.learnables
        .filter((id) => !deleteIDs.includes(id))
        .concat(addIDs)

      return {
        ...c,
        learnables: updatedLearnables
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
