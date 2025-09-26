import { withStorageSync } from '@angular-architects/ngrx-toolkit'
import { computed, inject } from '@angular/core'
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState
} from '@ngrx/signals'
import { AiService } from '../services/ai.service'
import {
  LearnableBase,
  LearnablePartialWithId,
  StoreExport
} from '../types_and_schemas/types'
import { getCollectionlessLearnableIds } from '../utils/genaral-utils'
import { initialLearnables } from './initialStates'
import {
  createCollection,
  deleteCollection,
  editCollection as editCollectionLearnables,
  quitPractice,
  quitPracticeEarly,
  removeLearnables,
  renameCollection,
  saveImportedCollections,
  saveNewlyCreatedLearnables,
  setGuess,
  startPractice,
  updateLearnables
} from './learnableMutators'

export const LearnablesStore = signalStore(
  { providedIn: 'root' },
  withState(initialLearnables),
  withStorageSync({
    key: 'language_helper_learnables',
    storage: () => localStorage
  }),
  withComputed(({ learnables, collections }) => ({
    collectionLessLearnableIds: computed(() =>
      getCollectionlessLearnableIds(learnables(), collections())
    ),
    pseudoCollections: computed(() => {
      let pseudoCollections: {
        name: string
        learnableIDs: string[]
        id: string
      }[] = []

      const collectionlessIds = getCollectionlessLearnableIds(
        learnables(),
        collections()
      )

      pseudoCollections.push({
        name: 'All',
        learnableIDs: learnables().map((l) => l.id),
        id: crypto.randomUUID()
      })

      if (collectionlessIds.length > 0) {
        pseudoCollections.push({
          name: 'Unsorted',
          learnableIDs: collectionlessIds,
          id: crypto.randomUUID()
        })
      }

      return pseudoCollections
    })
  })),
  withMethods((state) => {
    const aiS = inject(AiService)

    return {
      addLearnables(learnablesBase: LearnableBase[]) {
        patchState(state, saveNewlyCreatedLearnables(learnablesBase))
      },
      updateLearnables(learnables: LearnablePartialWithId[]) {
        patchState(state, updateLearnables(learnables))
      },
      removeLearnables(ids: string[]) {
        patchState(state, removeLearnables(ids))
      },
      startPractice(ids: string[], reverseDirection: boolean) {
        patchState(state, startPractice(ids, reverseDirection))
      },
      createCollection(name: string, ids: string[]) {
        patchState(state, createCollection(name, ids))
      },
      editCollectionLearnables(
        collectionID: string,
        addIDs: string[],
        deleteIDs: string[]
      ) {
        patchState(
          state,
          editCollectionLearnables(collectionID, addIDs, deleteIDs)
        )
      },
      importExportedCollections(importStore: StoreExport) {
        patchState(state, saveImportedCollections(importStore))
      },
      editCollection(name: string, id: string) {
        patchState(state, renameCollection(name, id))
      },
      deleteCollection(id: string, removeLearnables: boolean = false) {
        const collection = state.collections().find((c) => c.id === id)
        if (!collection) return
        const learnableIDs = collection.learnableIDs
        patchState(state, deleteCollection(id))

        if (removeLearnables) {
          this.removeLearnables(learnableIDs)
        }
      },
      quitPracticePrematurly() {
        patchState(state, quitPracticeEarly())
      },
      quitPractice() {
        patchState(state, quitPractice())
      },
      setGuess(isCorrect: boolean) {
        patchState(state, setGuess(isCorrect))
      },
      reset() {
        patchState(state, initialLearnables)
      }
    }
  })
)
