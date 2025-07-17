import { withStorageSync } from '@angular-architects/ngrx-toolkit'
import { inject } from '@angular/core'
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
import { AiService } from '../services/ai.service'
import {
  LearnableBase,
  LearnableCreationConfig,
  LearnablePartialWithId
} from '../types_and_schemas/types'
import { initialLearnables } from './initialStates'
import {
  createCollection,
  deleteCollection,
  editCollection,
  quitPractice,
  quitPracticeEarly,
  removeLearnables,
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
      async generate(config: LearnableCreationConfig) {},
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
      editCollection(
        collectionID: string,
        addIDs: string[],
        deleteIDs: string[]
      ) {
        patchState(state, editCollection(collectionID, addIDs, deleteIDs))
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
