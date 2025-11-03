import {
  BankBase,
  CollectionUser,
  LearnableBase,
  LearnablesStoreType,
  UserLearnable,
  UserLearnablePartial
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
    // do the duplicate thing in here too

    return {
      ...state,
      banks: state.banks.map((b) => {
        if (b.id !== state.activeBankId) return b

        return {
          ...b,
          learnables: [...b.learnables, ...learnables]
        }
      })
    }
  }

export const setGuess =
  (isCorrect: boolean) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const currentP = state.currentPractice
    if (!currentP) return state
    const currentLearnableId = currentP.ids[currentP.index]

    return {
      ...state,
      banks: state.banks.map((b) => {
        if (b.id !== state.activeBankId) return b

        return {
          ...b,
          learnables: b.learnables.map((l) => {
            if (l.id !== currentLearnableId) return l
            return addGuessToLearnable(l, isCorrect, currentP.reverseDirection)
          })
        }
      })
    }
  }

export const removeLearnables =
  (ids: string[]) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    // reset practice to prevent lost ids and loose indexes in practice
    const currentPracticeHasDeletedIds = state.currentPractice?.ids.some((id) =>
      ids.includes(id)
    )

    return {
      ...state,
      currentPractice: currentPracticeHasDeletedIds
        ? null
        : state.currentPractice,
      banks: state.banks.map((b) => {
        if (b.id !== state.activeBankId) return b
        return {
          ...b,
          learnables: b.learnables.filter((l) => !ids.includes(l.id))
        }
      })
    }
  }

export const updateLearnables =
  (updatedL: UserLearnablePartial[]) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    return {
      ...state,
      banks: state.banks.map((b) => {
        if (b.id !== state.activeBankId) return b
        return {
          ...b,
          learnables: b.learnables.map((l) => {
            const updated = updatedL.find((ul) => ul.id === l.id)
            if (!updated) return l
            return {
              ...l,
              ...updated
            }
          })
        }
      })
    }
  }

export const saveImportedCollections =
  (storeImport: BankBase) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    return {
      ...state,

      banks: state.banks.map((b) => {
        if (b.id !== state.activeBankId) return b

        const { learnables: newLearnables, collections: newCollections } =
          mapFileImportToAddableLearnables(storeImport, b.learnables)

        return {
          ...b,
          learnables: [...b.learnables, ...newLearnables],
          collections: [...b.collections, ...newCollections]
        }
      })
    }
  }

const mapBaseToFullToLearnables = (
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
    collectionIds: [],
    guesses: {
      lexeme: [false, false, false, false, false],
      translation: [false, false, false, false, false]
    }
  }))
}

const addGuessToLearnable = (
  learnable: UserLearnable,
  isCorrect: boolean,
  reverseDirection: boolean
): UserLearnable => {
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

export const removePractice =
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
      banks: state.banks.map((b) => {
        if (b.id !== state.activeBankId) return b

        return {
          ...b,
          collections: [...b.collections, createNewCollection(name, ids)]
        }
      })
    }
  }

export const editCollection =
  (collectionID: string, addIDs: string[], deleteIDs: string[]) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    return {
      ...state,
      banks: state.banks.map((b) => {
        if (b.id !== state.activeBankId) return b

        return {
          ...b,
          learnables: b.learnables.map((l) => {
            if (addIDs.includes(l.id)) {
              return {
                ...l,
                collectionIds: [...new Set([...l.collectionIds, collectionID])]
              }
            } else if (deleteIDs.includes(l.id)) {
              return {
                ...l,
                collectionIds: l.collectionIds.filter(
                  (cid) => cid !== collectionID
                )
              }
            }
            return l
          })
        }
      })
    }
  }

export const deleteCollection =
  (id: string) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    return {
      ...state,
      banks: state.banks.map((b) => {
        if (b.id !== state.activeBankId) return b

        return {
          ...b,
          collections: b.collections.filter((c) => c.id !== id)
        }
      })
    }
  }

export const renameCollection =
  (id: string, name: string) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    return {
      ...state,
      banks: state.banks.map((b) => {
        if (b.id !== state.activeBankId) return b

        return {
          ...b,
          collections: b.collections.map((c) => {
            if (c.id !== id) return c

            return {
              ...c,
              name
            }
          })
        }
      })
    }
  }

const createNewCollection = (name: string, ids: string[]): CollectionUser => ({
  id: crypto.randomUUID(),
  created: new Date(),
  name
})
