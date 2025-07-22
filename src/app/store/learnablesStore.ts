import { withStorageSync } from '@angular-architects/ngrx-toolkit'
import { inject } from '@angular/core'
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
import { AiService } from '../services/ai.service'
import {
  ExportedCollection,
  LearnableBase,
  LearnablePartialWithId
} from '../types_and_schemas/types'
import { mapToExpCollection } from '../utils/import-export-utils'
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
  saveNewLearnables,
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
  withMethods((state) => {
    const aiS = inject(AiService)

    return {
      addLearnables(learnablesBase: LearnableBase[]) {
        patchState(state, saveNewLearnables(learnablesBase))
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
      getExportableCollections(
        onlyForCollectionId?: string
      ): ExportedCollection[] {
        // return all when no id is peciffied
        const collections = state
          .collections()
          .filter((c) =>
            onlyForCollectionId ? c.id === onlyForCollectionId : true
          )

        const allLearnables = state.learnables()
        return collections.map((c) => mapToExpCollection(allLearnables, c))
      },
      importExportedCollections(impCollections: ExportedCollection[]) {
        patchState(state, saveImportedCollections(impCollections))
      },
      editCollection(name: string, id: string) {
        patchState(state, renameCollection(name, id))
      },
      deleteCollection(id: string) {
        patchState(state, deleteCollection(id))
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
