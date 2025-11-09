import {
  BankBase,
  Collection,
  CollectionUser,
  LanguageConfig,
  LearnableBase,
  LearnablesStoreType,
  LearnableWithId,
  UserLearnable,
  UserLearnablePartial
} from '../types_and_schemas/types'

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
  (isCorrect: boolean) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    // no practice running
    const currentP = state.currentPractice
    if (!currentP) return state

    // practice already finished
    const currentLearnableId = currentP.ids[currentP.index]
    if (!currentLearnableId) return state

    return {
      ...state,
      currentPractice: {
        ...currentP,
        index: currentP.index + 1,
        guesses: [...currentP.guesses, { id: currentLearnableId, isCorrect }]
      },
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

const remapCollectionIds = (collections: Collection[]) => {
  const collectionIdMap = new Map<string, string>()
  const remappedCollections = collections.map((c) => {
    const newId = crypto.randomUUID()
    collectionIdMap.set(c.id, newId)
    return { ...c, id: newId }
  })
  return { collectionIdMap, remappedCollections }
}

const prepareImportedLearnables = (
  learnables: LearnableWithId[],
  collectionIdMap: Map<string, string>
): UserLearnable[] => {
  const now = new Date()
  return learnables.map((l) => ({
    ...l,
    id: crypto.randomUUID(),
    created: now,
    collectionIds: l.collectionIds.map(
      (cid: string) => collectionIdMap.get(cid) ?? cid
    ),
    guesses: {
      lexeme: [false, false, false, false, false],
      translation: [false, false, false, false, false]
    }
  }))
}

const filterNewCollections = (
  imported: Collection[],
  existing: CollectionUser[]
): CollectionUser[] => {
  const now = new Date()
  return imported
    .filter((c) => !existing.some((ec) => ec.name === c.name))
    .map((c) => ({ ...c, created: now }))
}

const learnablesMatch = (l1: LearnableBase, l2: LearnableBase) =>
  l1.lexeme === l2.lexeme && l1.translation === l2.translation

const mergeLearnables = (
  existing: UserLearnable[],
  imported: UserLearnable[]
) => {
  const merged = existing.map((l) => {
    const match = imported.find((il) => learnablesMatch(l, il))
    if (match) {
      return {
        ...l,
        collectionIds: [...l.collectionIds, ...match.collectionIds]
      }
    }
    return l
  })

  const newItems = imported.filter(
    (il) => !existing.some((l) => learnablesMatch(l, il))
  )

  return { merged, newItems }
}

const filterValidCollectionIds = (
  learnables: UserLearnable[],
  collections: CollectionUser[]
): UserLearnable[] => {
  const validIds = new Set(collections.map((c) => c.id))
  return learnables.map((l) => ({
    ...l,
    collectionIds: l.collectionIds.filter((cid) => validIds.has(cid))
  }))
}

export const saveImportedCollections =
  ({ learnables, collections }: BankBase) =>
  (state: LearnablesStoreType): LearnablesStoreType => {
    return {
      ...state,
      banks: state.banks.map((b) => {
        if (b.id !== state.activeBankId) return b

        const { collectionIdMap, remappedCollections } =
          remapCollectionIds(collections)
        const importedLearnables = prepareImportedLearnables(
          learnables,
          collectionIdMap
        )

        const newCollections = filterNewCollections(
          remappedCollections,
          b.collections
        )
        const { merged, newItems } = mergeLearnables(
          b.learnables,
          importedLearnables
        )

        const allCollections = [...b.collections, ...newCollections]
        const allLearnables = filterValidCollectionIds(
          [...merged, ...newItems],
          allCollections
        )

        return {
          ...b,
          learnables: allLearnables,
          collections: allCollections
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
        const newCollection = createNewCollection(name)

        return {
          ...b,
          collections: [...b.collections, newCollection],
          learnables: b.learnables.map((l) => {
            if (ids.includes(l.id)) {
              return {
                ...l,
                collectionIds: [
                  ...new Set([...l.collectionIds, newCollection.id])
                ]
              }
            }
            return l
          })
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

const createNewCollection = (name: string): CollectionUser => ({
  id: crypto.randomUUID(),
  created: new Date(),
  name
})
