import {
  BankShare,
  CollectionUser,
  Guess,
  Guessable,
  LanguageConfig,
  LearnableBase,
  LearnablesStoreType,
  UserLearnable,
  UserLearnablePartial
} from '../types_and_schemas/types'

export const startPractice =
  (ids: string[], reverseDirection: boolean) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    // randomize order of ids to prevent memorization of order
    const randomizedGuessables: Guessable[] = [...ids]
      .sort(() => Math.random() - 0.5)
      .map((id) => ({
        id,
        guessed: 'unanswered'
      }))

    return {
      ...state,
      currentPractice: {
        guessables: randomizedGuessables,
        index: 0,
        reverseDirection
      }
    }
  }

export const saveNewlyCreatedLearnables =
  (learnablesBase: LearnableBase[]) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    return {
      ...state,
      banks: state.banks.map((b) => {
        if (b.id !== state.activeBankId) return b

        // Filter out duplicates in input and items that already exist in bank
        const newLearnables = learnablesBase.filter(
          (lb, index, self) =>
            self.findIndex(
              (other) =>
                other.lexeme === lb.lexeme &&
                other.translation === lb.translation
            ) === index &&
            !b.learnables.some(
              (l) => lb.lexeme === l.lexeme && lb.translation === l.translation
            )
        )

        const fullNew = mapBaseToFullToLearnables(newLearnables)

        return {
          ...b,
          learnables: [...b.learnables, ...fullNew]
        }
      })
    }
  }

export const updateBankLanguage =
  (language: LanguageConfig) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    return {
      ...state,
      banks: state.banks.map((b) => {
        if (b.id !== state.activeBankId) return b
        return {
          ...b,
          language
        }
      })
    }
  }

export const setGuess =
  (guess: Guess) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    // no practice running
    const practice = state.currentPractice
    if (!practice) return state

    // practice already finished
    const currentGuessable = practice.guessables[practice.index]
    if (!currentGuessable) return state

    return {
      ...state,
      currentPractice: {
        ...practice,
        index: practice.index + 1,
        guessables: updateGuessables(
          practice.guessables,
          currentGuessable.id,
          guess
        )
      },
      banks: state.banks.map((b) => {
        if (b.id !== state.activeBankId) return b
        return {
          ...b,
          learnables: b.learnables.map((l) => {
            if (l.id !== currentGuessable.id || guess === 'unanswered') return l
            const guessedRight = guess === 'right'

            return addGuessToLearnable(
              l,
              guessedRight,
              practice.reverseDirection
            )
          })
        }
      })
    }
  }

const updateGuessables = (
  guessables: Guessable[],
  id: string,
  guessed: Guess
): Guessable[] => {
  return guessables.map((g) => (g.id === id ? { ...g, guessed } : g))
}

// Helper to check if practice should be reset when cards are deleted
const shouldResetPractice = (
  state: LearnablesStoreType,
  idsToDelete: string[]
): boolean =>
  state.currentPractice?.guessables.some((g) => idsToDelete.includes(g.id)) ??
  false

// Helper to remove learnables from the active bank
const removeLearnablesFromBank = (
  state: LearnablesStoreType,
  idsToDelete: string[]
): LearnablesStoreType => ({
  ...state,
  currentPractice: shouldResetPractice(state, idsToDelete)
    ? null
    : state.currentPractice,
  banks: state.banks.map((b) => {
    if (b.id !== state.activeBankId) return b
    return {
      ...b,
      learnables: b.learnables.filter((l) => !idsToDelete.includes(l.id)),
      collections: b.collections.map((c) => ({
        ...c,
        cardIds: c.cardIds.filter((cardId) => !idsToDelete.includes(cardId))
      }))
    }
  })
})

export const removeLearnables =
  (ids: string[]) =>
  (state: LearnablesStoreType): LearnablesStoreType =>
    removeLearnablesFromBank(state, ids)

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

const learnablesMatch = (l1: LearnableBase, l2: LearnableBase) =>
  l1.lexeme === l2.lexeme && l1.translation === l2.translation

export const saveImportedCollections =
  ({ learnables, collections }: BankShare) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    return {
      ...state,
      banks: state.banks.map((b) => {
        if (b.id !== state.activeBankId) return b

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
              guesses: {
                lexeme: [false, false, false, false, false],
                translation: [false, false, false, false, false]
              }
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
        index: currentPractice.guessables.length
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
  (name: string, cardIds: string[]) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    return {
      ...state,
      banks: state.banks.map((b) => {
        if (b.id !== state.activeBankId) return b
        const newCollection = createNewCollection(name, cardIds)

        return {
          ...b,
          collections: [...b.collections, newCollection]
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
          collections: b.collections.map((c) => {
            if (c.id !== collectionID) return c

            const updatedCardIds = [
              ...new Set([...c.cardIds, ...addIDs])
            ].filter((cardId) => !deleteIDs.includes(cardId))

            return {
              ...c,
              cardIds: updatedCardIds
            }
          })
        }
      })
    }
  }

export const deleteCollection =
  (id: string, removeCards: boolean) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    const activeBank = state.banks.find((b) => b.id === state.activeBankId)
    const cardIds =
      activeBank?.collections.find((c) => c.id === id)?.cardIds ?? []

    // Remove the collection
    const stateWithoutCollection: LearnablesStoreType = {
      ...state,
      banks: state.banks.map((b) => {
        if (b.id !== state.activeBankId) return b
        return {
          ...b,
          collections: b.collections.filter((c) => c.id !== id)
        }
      })
    }

    // Optionally remove the cards using shared helper
    if (removeCards && cardIds.length > 0) {
      return removeLearnablesFromBank(stateWithoutCollection, cardIds)
    }

    return stateWithoutCollection
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

const createNewCollection = (
  name: string,
  cardIds: string[]
): CollectionUser => ({
  id: crypto.randomUUID(),
  created: new Date(),
  name,
  cardIds
})
